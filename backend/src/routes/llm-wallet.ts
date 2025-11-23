import express from 'express';
import llmWalletService from '../services/llm-wallet';

const router = express.Router();

/**
 * GET /api/llm-wallet/:agentId/context
 * Obtiene el contexto del wallet de un agente (MCP)
 */
router.get('/:agentId/context', async (req, res) => {
  try {
    const { agentId } = req.params;

    const context = await llmWalletService.getWalletContext(agentId);

    res.json({
      success: true,
      agentId,
      context,
    });
  } catch (error: any) {
    console.error('Error getting LLM wallet context:', error);
    res.status(500).json({
      error: 'Error al obtener contexto del wallet',
      message: error.message,
    });
  }
});

/**
 * GET /api/llm-wallet/:agentId/balance
 * Obtiene el balance del wallet de un agente
 */
router.get('/:agentId/balance', async (req, res) => {
  try {
    const { agentId } = req.params;

    const balance = await llmWalletService.getBalance(agentId);
    const address = llmWalletService.getAddress(agentId);

    res.json({
      success: true,
      agentId,
      address,
      balance,
      balanceMatic: `${balance} MATIC`,
    });
  } catch (error: any) {
    console.error('Error getting LLM wallet balance:', error);
    res.status(500).json({
      error: 'Error al obtener balance del wallet',
      message: error.message,
    });
  }
});

/**
 * POST /api/llm-wallet/:agentId/sign
 * Firma un mensaje con el wallet del agente
 */
router.post('/:agentId/sign', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message es requerido' });
    }

    const signature = await llmWalletService.signMessage(agentId, message);
    const address = llmWalletService.getAddress(agentId);

    res.json({
      success: true,
      agentId,
      address,
      message,
      signature,
    });
  } catch (error: any) {
    console.error('Error signing message:', error);
    res.status(500).json({
      error: 'Error al firmar mensaje',
      message: error.message,
    });
  }
});

/**
 * POST /api/llm-wallet/verify
 * Verifica una firma de mensaje
 */
router.post('/verify', async (req, res) => {
  try {
    const { message, signature } = req.body;

    if (!message || !signature) {
      return res.status(400).json({ error: 'message y signature son requeridos' });
    }

    const address = llmWalletService.verifyMessage(message, signature);

    res.json({
      success: true,
      message,
      signature,
      address,
      verified: true,
    });
  } catch (error: any) {
    console.error('Error verifying message:', error);
    res.status(500).json({
      error: 'Error al verificar firma',
      message: error.message,
    });
  }
});

/**
 * POST /api/llm-wallet/:agentId/send-transaction
 * Envía una transacción desde el wallet del agente
 */
router.post('/:agentId/send-transaction', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { to, value, data } = req.body;

    if (!to || !value) {
      return res.status(400).json({ error: 'to y value son requeridos' });
    }

    const txHash = await llmWalletService.sendTransaction(agentId, to, value, data);
    const address = llmWalletService.getAddress(agentId);

    res.json({
      success: true,
      agentId,
      from: address,
      to,
      value,
      txHash,
      polygonScanUrl: `https://polygonscan.com/tx/${txHash}`,
    });
  } catch (error: any) {
    console.error('Error sending transaction:', error);
    res.status(500).json({
      error: 'Error al enviar transacción',
      message: error.message,
    });
  }
});

/**
 * POST /api/llm-wallet/:agentId/create
 * Crea un nuevo wallet para un agente
 */
router.post('/:agentId/create', async (req, res) => {
  try {
    const { agentId } = req.params;

    const wallet = llmWalletService.createWallet(agentId);
    const balance = await llmWalletService.getBalance(agentId);

    res.json({
      success: true,
      agentId,
      address: wallet.address,
      privateKey: wallet.privateKey, // ⚠️ En producción, nunca exponer la clave privada
      balance,
      warning: '⚠️ Guarda la clave privada de forma segura. En producción, esto no debería exponerse.',
    });
  } catch (error: any) {
    console.error('Error creating wallet:', error);
    res.status(500).json({
      error: 'Error al crear wallet',
      message: error.message,
    });
  }
});

/**
 * GET /api/llm-wallet/list
 * Lista todos los wallets disponibles
 */
router.get('/list', (req, res) => {
  try {
    const wallets = llmWalletService.listWallets();

    res.json({
      success: true,
      wallets,
      count: wallets.length,
    });
  } catch (error: any) {
    console.error('Error listing wallets:', error);
    res.status(500).json({
      error: 'Error al listar wallets',
      message: error.message,
    });
  }
});

export { router as llmWalletRouter };

