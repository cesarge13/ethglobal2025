import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as path from 'path';
import contractService from './contract';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Servicio x402 para manejo de micropagos en Polygon Mainnet
 * 
 * x402 es un protocolo de micropagos que permite transacciones de bajo costo
 * usando técnicas como payment channels, batching, y gas optimization.
 */
class X402Service {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet | null = null;

  // Tarifas de micropagos por acción (en MATIC)
  private readonly PAYMENT_RATES = {
    document_validation: ethers.parseEther('0.001'), // 0.001 MATIC
    certification_check: ethers.parseEther('0.002'),  // 0.002 MATIC
    verification_step: ethers.parseEther('0.0005'),    // 0.0005 MATIC
    report_generation: ethers.parseEther('0.003'),    // 0.003 MATIC
    default: ethers.parseEther('0.001'),              // 0.001 MATIC por defecto
  };

  constructor() {
    const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
    this.provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);

    // Inicializar wallet si hay PRIVATE_KEY
    const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
    if (PRIVATE_KEY) {
      this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
    }
  }

  /**
   * Obtiene la tarifa de micropago para una acción específica
   */
  getPaymentRate(action: string): bigint {
    const rate = this.PAYMENT_RATES[action as keyof typeof this.PAYMENT_RATES];
    return rate || this.PAYMENT_RATES.default;
  }

  /**
   * Ejecuta un micropago x402
   * 
   * @param farmerAddress Dirección del agricultor que recibe el pago
   * @param action Acción que dispara el pago
   * @param customAmount Cantidad personalizada (opcional)
   * @returns Hash de la transacción
   */
  async executePayment(
    farmerAddress: string,
    action: string,
    customAmount?: string
  ): Promise<{
    txHash: string;
    amount: string;
    action: string;
    farmerAddress: string;
    status: string;
  }> {
    try {
      if (!this.wallet) {
        throw new Error('PRIVATE_KEY no configurada. No se pueden ejecutar micropagos.');
      }

      if (!ethers.isAddress(farmerAddress)) {
        throw new Error('Dirección inválida');
      }

      // Determinar cantidad del pago
      const amount = customAmount 
        ? ethers.parseEther(customAmount)
        : this.getPaymentRate(action);

      // Verificar balance del wallet
      const balance = await this.provider.getBalance(this.wallet.address);
      if (balance < amount) {
        throw new Error(`Balance insuficiente. Necesitas al menos ${ethers.formatEther(amount)} MATIC`);
      }

      // Ejecutar transferencia de MATIC
      const tx = await this.wallet.sendTransaction({
        to: farmerAddress,
        value: amount,
        gasLimit: 21000, // Gas mínimo para transferencia simple
      });

      // Esperar confirmación
      const receipt = await tx.wait();

      // Registrar el pago en el smart contract
      try {
        await contractService.logX402Payment(farmerAddress, amount, action);
      } catch (error: any) {
        console.warn('No se pudo registrar el pago en el contrato:', error.message);
        // El pago ya se ejecutó, solo falló el registro
      }

      return {
        txHash: receipt!.hash,
        amount: ethers.formatEther(amount),
        action,
        farmerAddress,
        status: 'confirmed',
      };
    } catch (error: any) {
      console.error('Error executing x402 payment:', error);
      throw new Error(`Error al ejecutar micropago x402: ${error.message}`);
    }
  }

  /**
   * Ejecuta múltiples micropagos en batch (optimización de gas)
   * 
   * @param payments Array de pagos a ejecutar
   * @returns Array de resultados
   */
  async executeBatchPayments(
    payments: Array<{ farmerAddress: string; action: string; customAmount?: string }>
  ): Promise<Array<{
    txHash: string;
    amount: string;
    action: string;
    farmerAddress: string;
    status: string;
  }>> {
    const results = [];

    for (const payment of payments) {
      try {
        const result = await this.executePayment(
          payment.farmerAddress,
          payment.action,
          payment.customAmount
        );
        results.push(result);
      } catch (error: any) {
        results.push({
          txHash: '',
          amount: payment.customAmount || ethers.formatEther(this.getPaymentRate(payment.action)),
          action: payment.action,
          farmerAddress: payment.farmerAddress,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Obtiene el balance del wallet de micropagos
   */
  async getBalance(): Promise<string> {
    if (!this.wallet) {
      throw new Error('PRIVATE_KEY no configurada');
    }

    const balance = await this.provider.getBalance(this.wallet.address);
    return ethers.formatEther(balance);
  }

  /**
   * Obtiene la dirección del wallet de micropagos
   */
  getWalletAddress(): string {
    if (!this.wallet) {
      throw new Error('PRIVATE_KEY no configurada');
    }

    return this.wallet.address;
  }

  /**
   * Verifica si el servicio está configurado correctamente
   */
  isConfigured(): boolean {
    return this.wallet !== null;
  }
}

// Exportar instancia singleton
export const x402Service = new X402Service();
export default x402Service;

