import express from 'express';
import { ethers } from 'ethers';
import x402Service from '../services/x402';
import autoPayService from '../services/autopay';

const router = express.Router();

/**
 * POST /api/execute-x402-payment
 * Ejecuta un micropago x402 en Polygon Mainnet
 * 
 * Body:
 * - farmerAddress: Dirección del agricultor
 * - amount: Cantidad en MATIC (como string, opcional - usa tarifa por defecto si no se especifica)
 * - action: Acción que dispara el pago (document_validation, certification_check, verification_step, report_generation)
 */
router.post('/', async (req, res) => {
  try {
    const { farmerAddress, amount, action } = req.body;

    if (!farmerAddress) {
      return res.status(400).json({ error: 'farmerAddress es requerido' });
    }

    if (!action) {
      return res.status(400).json({ error: 'action es requerido' });
    }

    if (!ethers.isAddress(farmerAddress)) {
      return res.status(400).json({ error: 'Dirección inválida' });
    }

    // Verificar que x402Service esté configurado
    if (!x402Service.isConfigured()) {
      return res.status(503).json({
        error: 'x402 Service no configurado',
        message: 'PRIVATE_KEY no configurada. Configura PRIVATE_KEY en el archivo .env del backend',
        instructions: [
          '1. Agrega PRIVATE_KEY a backend/.env',
          '2. La clave debe tener MATIC para ejecutar micropagos',
          '3. Reinicia el backend'
        ]
      });
    }

    // Ejecutar micropago x402
    const result = await x402Service.executePayment(farmerAddress, action, amount);

    res.json({
      success: true,
      paymentId: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      farmerAddress: result.farmerAddress,
      amount: result.amount,
      action: result.action,
      txHash: result.txHash,
      status: result.status,
      message: 'Micropago x402 ejecutado exitosamente en Polygon Mainnet',
      polygonScanUrl: `https://polygonscan.com/tx/${result.txHash}`,
      walletAddress: x402Service.getWalletAddress(),
    });
  } catch (error: any) {
    console.error('Error executing x402 payment:', error);
    res.status(500).json({
      error: 'Error al ejecutar micropago x402',
      message: error.message,
    });
  }
});

/**
 * POST /api/execute-batch-x402-payments
 * Ejecuta múltiples micropagos x402 en batch
 * 
 * Body:
 * - payments: Array de pagos [{ farmerAddress, action, amount? }]
 */
router.post('/batch', async (req, res) => {
  try {
    const { payments } = req.body;

    if (!payments || !Array.isArray(payments) || payments.length === 0) {
      return res.status(400).json({ error: 'payments es requerido y debe ser un array no vacío' });
    }

    if (!x402Service.isConfigured()) {
      return res.status(503).json({
        error: 'x402 Service no configurado',
        message: 'PRIVATE_KEY no configurada',
      });
    }

    const results = await x402Service.executeBatchPayments(payments);

    res.json({
      success: true,
      totalPayments: payments.length,
      successfulPayments: results.filter(r => r.status === 'confirmed').length,
      failedPayments: results.filter(r => r.status === 'failed').length,
      results,
    });
  } catch (error: any) {
    console.error('Error executing batch x402 payments:', error);
    res.status(500).json({
      error: 'Error al ejecutar micropagos batch x402',
      message: error.message,
    });
  }
});

/**
 * GET /api/x402-balance
 * Obtiene el balance del wallet de micropagos x402
 */
router.get('/x402-balance', async (req, res) => {
  try {
    if (!x402Service.isConfigured()) {
      return res.status(503).json({
        error: 'x402 Service no configurado',
      });
    }

    const balance = await x402Service.getBalance();
    const walletAddress = x402Service.getWalletAddress();

    res.json({
      success: true,
      walletAddress,
      balance,
      balanceMatic: `${balance} MATIC`,
      network: 'polygon-mainnet',
      chainId: 137,
    });
  } catch (error: any) {
    console.error('Error getting x402 balance:', error);
    res.status(500).json({
      error: 'Error al obtener balance x402',
      message: error.message,
    });
  }
});

/**
 * GET /api/x402-rates
 * Obtiene las tarifas de micropagos por acción
 */
router.get('/x402-rates', (req, res) => {
  try {
    const rates = {
      document_validation: '0.001 MATIC',
      certification_check: '0.002 MATIC',
      verification_step: '0.0005 MATIC',
      report_generation: '0.003 MATIC',
      default: '0.001 MATIC',
    };

    res.json({
      success: true,
      rates,
      network: 'polygon-mainnet',
      currency: 'MATIC',
    });
  } catch (error: any) {
    console.error('Error getting x402 rates:', error);
    res.status(500).json({
      error: 'Error al obtener tarifas x402',
      message: error.message,
    });
  }
});

export { router as paymentRouter };

