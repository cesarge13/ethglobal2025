import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Servicio LLM Wallet MCP (Model Context Protocol)
 * 
 * Este servicio permite que agentes IA (LLMs) manejen wallets y ejecuten transacciones
 * de forma segura usando el Model Context Protocol para gestión de contexto.
 */
class LLMWalletService {
  private provider: ethers.JsonRpcProvider;
  private wallets: Map<string, ethers.Wallet | ethers.HDNodeWallet> = new Map();

  // Configuración de wallets por agente/contexto
  private readonly WALLET_CONFIG = {
    // Wallet principal del sistema (puede ser un multisig o EOA)
    system: process.env.PRIVATE_KEY || '',
    
    // Wallets para diferentes agentes IA (pueden ser generados o configurados)
    agents: {
      document_validator: process.env.AGENT_VALIDATOR_KEY || '',
      certification_checker: process.env.AGENT_CERTIFIER_KEY || '',
      report_generator: process.env.AGENT_REPORTER_KEY || '',
    },
  };

  constructor() {
    const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
    this.provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);

    // Inicializar wallets configurados
    this.initializeWallets();
  }

  /**
   * Inicializa los wallets configurados
   */
  private initializeWallets(): void {
    // Wallet del sistema
    if (this.WALLET_CONFIG.system) {
      const systemWallet = new ethers.Wallet(this.WALLET_CONFIG.system, this.provider);
      this.wallets.set('system', systemWallet);
    }

    // Wallets de agentes
    Object.entries(this.WALLET_CONFIG.agents).forEach(([agentName, privateKey]) => {
      if (privateKey) {
        const agentWallet = new ethers.Wallet(privateKey, this.provider);
        this.wallets.set(agentName, agentWallet);
      }
    });
  }

  /**
   * Obtiene o crea un wallet para un agente específico
   * 
   * @param agentId ID del agente (ej: "document_validator", "certification_checker")
   * @returns Wallet del agente
   */
  getWallet(agentId: string): ethers.Wallet | ethers.HDNodeWallet {
    // Si el wallet ya existe, retornarlo
    if (this.wallets.has(agentId)) {
      return this.wallets.get(agentId)!;
    }

    // Si es un agente conocido pero no tiene wallet configurado, usar el sistema
    if (this.wallets.has('system')) {
      return this.wallets.get('system')!;
    }

    throw new Error(`Wallet no encontrado para agente: ${agentId}`);
  }

  /**
   * Crea un nuevo wallet para un agente (genera clave aleatoria)
   * 
   * @param agentId ID del agente
   * @returns Wallet creado
   */
  createWallet(agentId: string): ethers.HDNodeWallet {
    const wallet = ethers.Wallet.createRandom().connect(this.provider);
    this.wallets.set(agentId, wallet);
    return wallet;
  }

  /**
   * Obtiene el balance de un wallet de agente
   * 
   * @param agentId ID del agente
   * @returns Balance en MATIC
   */
  async getBalance(agentId: string): Promise<string> {
    const wallet = this.getWallet(agentId);
    const balance = await this.provider.getBalance(wallet.address);
    return ethers.formatEther(balance);
  }

  /**
   * Obtiene la dirección de un wallet de agente
   * 
   * @param agentId ID del agente
   * @returns Dirección del wallet
   */
  getAddress(agentId: string): string {
    const wallet = this.getWallet(agentId);
    return wallet.address;
  }

  /**
   * Firma un mensaje con el wallet del agente
   * 
   * @param agentId ID del agente
   * @param message Mensaje a firmar
   * @returns Firma del mensaje
   */
  async signMessage(agentId: string, message: string): Promise<string> {
    const wallet = this.getWallet(agentId);
    return await wallet.signMessage(message);
  }

  /**
   * Verifica una firma de mensaje
   * 
   * @param message Mensaje original
   * @param signature Firma a verificar
   * @returns Dirección que firmó el mensaje
   */
  verifyMessage(message: string, signature: string): string {
    return ethers.verifyMessage(message, signature);
  }

  /**
   * Ejecuta una transacción desde el wallet del agente
   * 
   * @param agentId ID del agente
   * @param to Dirección destino
   * @param value Valor en MATIC
   * @param data Datos de la transacción (opcional)
   * @returns Hash de la transacción
   */
  async sendTransaction(
    agentId: string,
    to: string,
    value: string,
    data?: string
  ): Promise<string> {
    const wallet = this.getWallet(agentId);
    
    const tx = await wallet.sendTransaction({
      to,
      value: ethers.parseEther(value),
      data: data || '0x',
    });

    await tx.wait();
    return tx.hash;
  }

  /**
   * Obtiene información del contexto del wallet (MCP)
   * 
   * @param agentId ID del agente
   * @returns Información del contexto
   */
  async getWalletContext(agentId: string): Promise<{
    address: string;
    balance: string;
    network: string;
    chainId: number;
    isConfigured: boolean;
  }> {
    const wallet = this.getWallet(agentId);
    const balance = await this.getBalance(agentId);
    const network = await this.provider.getNetwork();

    return {
      address: wallet.address,
      balance,
      network: network.name,
      chainId: Number(network.chainId),
      isConfigured: true,
    };
  }

  /**
   * Lista todos los wallets disponibles
   */
  listWallets(): string[] {
    return Array.from(this.wallets.keys());
  }
}

// Exportar instancia singleton
export const llmWalletService = new LLMWalletService();
export default llmWalletService;

