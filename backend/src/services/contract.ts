import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Cargar el ABI del contrato
const contractArtifactPath = path.join(__dirname, '../contracts/AgriculturalReputation.json');
const contractArtifact = JSON.parse(fs.readFileSync(contractArtifactPath, 'utf-8'));
const CONTRACT_ABI = contractArtifact.abi;

// Configuración
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''; // Para transacciones (solo si es necesario)

if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
  console.warn('⚠️ CONTRACT_ADDRESS no configurado. Algunas funciones pueden no funcionar.');
}

/**
 * Servicio para interactuar con el Smart Contract AgriculturalReputation
 */
class ContractService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private signer: ethers.Wallet | null = null;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
    
    // Inicializar signer si hay PRIVATE_KEY (para transacciones)
    if (PRIVATE_KEY) {
      this.signer = new ethers.Wallet(PRIVATE_KEY, this.provider);
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
    } else {
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
    }
  }

  /**
   * Obtiene información completa de un agricultor
   */
  async getFarmerInfo(farmerAddress: string): Promise<any> {
    try {
      if (!ethers.isAddress(farmerAddress)) {
        throw new Error('Dirección inválida');
      }

      const farmer = await this.contract.farmers(farmerAddress);
      
      return {
        farmerAddress: farmer.farmerAddress,
        farmerId: farmer.farmerId,
        reputationScore: Number(farmer.reputationScore),
        totalVerifications: Number(farmer.totalVerifications),
        validCertifications: Number(farmer.validCertifications),
        isRegistered: farmer.isRegistered,
        registrationDate: new Date(Number(farmer.registrationDate) * 1000).toISOString(),
      };
    } catch (error: any) {
      console.error('Error getting farmer info:', error);
      throw new Error(`Error al obtener información del agricultor: ${error.message}`);
    }
  }

  /**
   * Obtiene todos los documentos de un agricultor
   */
  async getFarmerDocuments(farmerAddress: string): Promise<any[]> {
    try {
      if (!ethers.isAddress(farmerAddress)) {
        throw new Error('Dirección inválida');
      }

      // Obtener el número de documentos
      const documents: any[] = [];
      let index = 0;
      let hasMore = true;

      // Leer documentos hasta que no haya más
      while (hasMore) {
        try {
          const doc = await this.contract.farmerDocuments(farmerAddress, index);
          documents.push({
            docHash: doc.docHash,
            docType: doc.docType,
            timestamp: new Date(Number(doc.timestamp) * 1000).toISOString(),
            isValidated: doc.isValidated,
            validatedBy: doc.validatedBy,
          });
          index++;
        } catch (error: any) {
          // Si hay un error, probablemente no hay más documentos
          hasMore = false;
        }
      }

      return documents;
    } catch (error: any) {
      console.error('Error getting farmer documents:', error);
      return [];
    }
  }

  /**
   * Obtiene todas las verificaciones de un agricultor
   */
  async getFarmerVerifications(farmerAddress: string): Promise<any[]> {
    try {
      if (!ethers.isAddress(farmerAddress)) {
        throw new Error('Dirección inválida');
      }

      const verifications: any[] = [];
      let index = 0;
      let hasMore = true;

      while (hasMore) {
        try {
          const verification = await this.contract.farmerVerifications(farmerAddress, index);
          verifications.push({
            step: Number(verification.step),
            status: verification.status,
            timestamp: new Date(Number(verification.timestamp) * 1000).toISOString(),
            verifiedBy: verification.verifiedBy,
            details: verification.details,
          });
          index++;
        } catch (error: any) {
          hasMore = false;
        }
      }

      return verifications;
    } catch (error: any) {
      console.error('Error getting farmer verifications:', error);
      return [];
    }
  }

  /**
   * Obtiene todas las certificaciones de un agricultor
   */
  async getFarmerCertifications(farmerAddress: string): Promise<string[]> {
    try {
      if (!ethers.isAddress(farmerAddress)) {
        throw new Error('Dirección inválida');
      }

      const certifications: string[] = [];
      let index = 0;
      let hasMore = true;

      while (hasMore) {
        try {
          const cert = await this.contract.certifications(farmerAddress, index);
          if (cert && cert !== '') {
            certifications.push(cert);
            index++;
          } else {
            hasMore = false;
          }
        } catch (error: any) {
          hasMore = false;
        }
      }

      return certifications;
    } catch (error: any) {
      console.error('Error getting farmer certifications:', error);
      return [];
    }
  }

  /**
   * Actualiza la reputación de un agricultor (requiere ser owner)
   */
  async updateReputation(farmerAddress: string, newScore: number): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error('PRIVATE_KEY no configurada. No se pueden realizar transacciones.');
      }

      if (!ethers.isAddress(farmerAddress)) {
        throw new Error('Dirección inválida');
      }

      if (newScore < 0 || newScore > 100) {
        throw new Error('El score debe estar entre 0 y 100');
      }

      const tx = await this.contract.updateReputation(farmerAddress, newScore);
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      console.error('Error updating reputation:', error);
      throw new Error(`Error al actualizar reputación: ${error.message}`);
    }
  }

  /**
   * Registra un nuevo agricultor (requiere ser owner)
   */
  async registerFarmer(farmerAddress: string, farmerId: string): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error('PRIVATE_KEY no configurada. No se pueden realizar transacciones.');
      }

      if (!ethers.isAddress(farmerAddress)) {
        throw new Error('Dirección inválida');
      }

      const tx = await this.contract.registerFarmer(farmerAddress, farmerId);
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      console.error('Error registering farmer:', error);
      throw new Error(`Error al registrar agricultor: ${error.message}`);
    }
  }

  /**
   * Registra un documento (requiere ser owner)
   */
  async registerDocument(
    farmerAddress: string,
    docHash: string,
    docType: string
  ): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error('PRIVATE_KEY no configurada. No se pueden realizar transacciones.');
      }

      if (!ethers.isAddress(farmerAddress)) {
        throw new Error('Dirección inválida');
      }

      const tx = await this.contract.registerDocument(farmerAddress, docHash, docType);
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      console.error('Error registering document:', error);
      throw new Error(`Error al registrar documento: ${error.message}`);
    }
  }

  /**
   * Registra una verificación (requiere ser owner)
   */
  async logVerification(
    farmerAddress: string,
    step: number,
    status: boolean,
    details: string
  ): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error('PRIVATE_KEY no configurada. No se pueden realizar transacciones.');
      }

      if (!ethers.isAddress(farmerAddress)) {
        throw new Error('Dirección inválida');
      }

      if (step < 1 || step > 4) {
        throw new Error('El step debe estar entre 1 y 4');
      }

      const tx = await this.contract.logVerification(farmerAddress, step, status, details);
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      console.error('Error logging verification:', error);
      throw new Error(`Error al registrar verificación: ${error.message}`);
    }
  }

  /**
   * Agrega una certificación (requiere ser owner)
   */
  async addCertification(farmerAddress: string, certification: string): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error('PRIVATE_KEY no configurada. No se pueden realizar transacciones.');
      }

      if (!ethers.isAddress(farmerAddress)) {
        throw new Error('Dirección inválida');
      }

      const tx = await this.contract.addCertification(farmerAddress, certification);
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      console.error('Error adding certification:', error);
      throw new Error(`Error al agregar certificación: ${error.message}`);
    }
  }

  /**
   * Obtiene el owner del contrato
   */
  async getOwner(): Promise<string> {
    try {
      return await this.contract.owner();
    } catch (error: any) {
      console.error('Error getting owner:', error);
      throw new Error(`Error al obtener owner: ${error.message}`);
    }
  }

  /**
   * Verifica si una dirección es el owner
   */
  async isOwner(address: string): Promise<boolean> {
    try {
      const owner = await this.getOwner();
      return owner.toLowerCase() === address.toLowerCase();
    } catch (error: any) {
      console.error('Error checking owner:', error);
      return false;
    }
  }

  /**
   * Registra un pago x402 en el smart contract (requiere ser owner)
   */
  async logX402Payment(
    farmerAddress: string,
    amount: bigint,
    action: string
  ): Promise<string> {
    try {
      if (!this.signer) {
        throw new Error('PRIVATE_KEY no configurada. No se pueden realizar transacciones.');
      }

      if (!ethers.isAddress(farmerAddress)) {
        throw new Error('Dirección inválida');
      }

      const tx = await this.contract.logX402Payment(farmerAddress, amount, action);
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      console.error('Error logging x402 payment:', error);
      throw new Error(`Error al registrar pago x402: ${error.message}`);
    }
  }
}

// Exportar instancia singleton
export const contractService = new ContractService();
export default contractService;

