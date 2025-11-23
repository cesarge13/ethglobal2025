import { ethers } from 'ethers';
import { buildPayload } from '../utils/payload.js';
import dotenv from 'dotenv';

dotenv.config();

// Configuración del executor MATE EVVM en Polygon Mainnet
const EXECUTOR_ADDRESS = process.env.EVVM_EXECUTOR_ADDRESS || '0x9902984d86059234c3B6e11D5eAEC55f9627dD0f';
const EVVM_ID = 2; // MATE EVVM ID
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;

// ABI mínimo del executor (solo la función que necesitamos)
const EXECUTOR_ABI = [
  "function execute(uint256 evvmId, bytes calldata payload) external returns (bytes memory)",
  "function executeWithNonce(uint256 evvmId, bytes calldata payload, uint256 nonce) external returns (bytes memory)"
];

/**
 * Registra un evento en MATE EVVM
 * @param {string} lotId - ID del lote
 * @param {string} eventType - Tipo de evento (HARVEST, SHIPPED, STORAGE)
 * @returns {Promise<{txHash: string, timestamp: number}>}
 */
export async function registerEvent(lotId, eventType) {
  // Validar configuración
  if (!RELAYER_PRIVATE_KEY) {
    throw new Error('RELAYER_PRIVATE_KEY no configurada en .env');
  }

  if (!POLYGON_RPC_URL || POLYGON_RPC_URL.includes('YOUR')) {
    throw new Error('POLYGON_RPC_URL no configurada correctamente en .env');
  }

  // Conectar a Polygon Mainnet
  const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
  const wallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, provider);

  console.log(`🔗 Conectado a Polygon Mainnet con wallet: ${wallet.address}`);

  // Verificar balance
  const balance = await provider.getBalance(wallet.address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} MATIC`);

  if (balance === 0n) {
    throw new Error('Wallet sin fondos. Necesitas MATIC en Polygon Mainnet para pagar gas.');
  }

  // Construir payload
  const payload = buildPayload(lotId, eventType);
  console.log(`📦 Payload construido: ${payload}`);

  // Obtener el contrato executor
  const executor = new ethers.Contract(EXECUTOR_ADDRESS, EXECUTOR_ABI, wallet);

  // Obtener nonce automáticamente
  const nonce = await provider.getTransactionCount(wallet.address, 'pending');
  console.log(`🔢 Nonce: ${nonce}`);

  try {
    // Intentar ejecutar con nonce explícito (más confiable)
    console.log(`🚀 Ejecutando en MATE EVVM (ID: ${EVVM_ID}) en Polygon Mainnet...`);
    const tx = await executor.executeWithNonce(
      EVVM_ID,
      payload,
      nonce,
      {
        gasLimit: 500000, // Límite de gas suficiente
      }
    );

    console.log(`⏳ Transacción enviada: ${tx.hash}`);
    console.log(`⏳ Esperando confirmación...`);

    // Esperar confirmación
    const receipt = await tx.wait();
    console.log(`✅ Transacción confirmada en bloque: ${receipt.blockNumber}`);

    return {
      txHash: receipt.hash,
      timestamp: Date.now(),
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };

  } catch (error) {
    // Si falla con nonce explícito, intentar sin nonce
    if (error.message.includes('nonce') || error.message.includes('replacement')) {
      console.log(`⚠️  Error con nonce explícito, intentando sin nonce...`);
      try {
        const tx = await executor.execute(
          EVVM_ID,
          payload,
          {
            gasLimit: 500000,
          }
        );

        console.log(`⏳ Transacción enviada: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`✅ Transacción confirmada en bloque: ${receipt.blockNumber}`);

        return {
          txHash: receipt.hash,
          timestamp: Date.now(),
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString()
        };
      } catch (retryError) {
        throw new Error(`Error ejecutando transacción: ${retryError.message}`);
      }
    }
    throw error;
  }
}
