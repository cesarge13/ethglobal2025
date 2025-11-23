import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Servicio para interactuar con blockchain y Smart Contract
 */
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
    this.provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);

    const PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY || process.env.PRIVATE_KEY || '';
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';

    if (PRIVATE_KEY) {
      this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
    }

    if (CONTRACT_ADDRESS && this.wallet) {
      // Cargar ABI del contrato
      const contractArtifactPath = path.join(__dirname, '../../contracts/AgriculturalReputation.json');
      if (fs.existsSync(contractArtifactPath)) {
        const contractArtifact = JSON.parse(fs.readFileSync(contractArtifactPath, 'utf-8'));
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, this.wallet);
      }
    }
  }

  /**
   * Ejecuta un micropago x402
   */
  async executeX402Payment(
    farmerAddress: string,
    amount: string,
    action: string
  ): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet no configurado');
    }

    const tx = await this.wallet.sendTransaction({
      to: farmerAddress,
      value: ethers.parseEther(amount),
      gasLimit: 21000,
    });

    await tx.wait();

    // Registrar en contrato si está disponible
    if (this.contract) {
      try {
        await this.contract.logX402Payment(farmerAddress, ethers.parseEther(amount), action);
      } catch (error) {
        console.warn('No se pudo registrar pago en contrato:', error);
      }
    }

    return tx.hash;
  }

  /**
   * Registra un documento en el contrato
   */
  async registerDocument(
    farmerAddress: string,
    docHash: string,
    docType: string
  ): Promise<string> {
    if (!this.contract) {
      throw new Error('Contrato no configurado');
    }

    const tx = await this.contract.registerDocument(farmerAddress, docHash, docType);
    await tx.wait();
    return tx.hash;
  }

  /**
   * Registra una verificación
   */
  async logVerification(
    farmerAddress: string,
    step: number,
    status: boolean,
    details: string
  ): Promise<string> {
    if (!this.contract) {
      throw new Error('Contrato no configurado');
    }

    const tx = await this.contract.logVerification(farmerAddress, step, status, details);
    await tx.wait();
    return tx.hash;
  }

  /**
   * Actualiza la reputación
   */
  async updateReputation(farmerAddress: string, newScore: number): Promise<string> {
    if (!this.contract) {
      throw new Error('Contrato no configurado');
    }

    const tx = await this.contract.updateReputation(farmerAddress, newScore);
    await tx.wait();
    return tx.hash;
  }

  /**
   * Obtiene información del agricultor
   */
  async getFarmerInfo(farmerAddress: string): Promise<any> {
    if (!this.contract) {
      throw new Error('Contrato no configurado');
    }

    return await this.contract.farmers(farmerAddress);
  }
}

