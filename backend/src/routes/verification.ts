import express from 'express';
import { ethers } from 'ethers';
import contractService from '../services/contract';

const router = express.Router();

/**
 * POST /api/request-verification
 * Solicita verificación de documentos por el agente IA
 * 
 * Body:
 * - farmerAddress: Dirección del agricultor
 * - documentHashes: Array de hashes de documentos a verificar
 */
router.post('/', async (req, res) => {
  try {
    const { farmerAddress, documentHashes } = req.body;

    if (!farmerAddress) {
      return res.status(400).json({ error: 'farmerAddress es requerido' });
    }

    if (!ethers.isAddress(farmerAddress)) {
      return res.status(400).json({ error: 'Dirección inválida' });
    }

    if (!documentHashes || !Array.isArray(documentHashes) || documentHashes.length === 0) {
      return res.status(400).json({ error: 'documentHashes es requerido y debe ser un array' });
    }

    // Verificar que el agricultor esté registrado
    let farmerInfo;
    try {
      farmerInfo = await contractService.getFarmerInfo(farmerAddress);
      if (!farmerInfo.isRegistered) {
        return res.status(400).json({ 
          error: 'Agricultor no registrado',
          message: 'El agricultor debe estar registrado antes de solicitar verificaciones'
        });
      }
    } catch (error: any) {
      return res.status(400).json({ 
        error: 'Error al verificar agricultor',
        message: error.message 
      });
    }

    // TODO: Integrar con agente IA para procesamiento real
    // El agente IA procesará los documentos y ejecutará micropagos x402
    // Por ahora, solo registramos la solicitud

    const verificationId = `verification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      success: true,
      verificationId,
      farmerAddress,
      farmerId: farmerInfo.farmerId,
      currentReputation: farmerInfo.reputationScore,
      documentHashes,
      status: 'queued',
      message: 'Verificación en cola. El agente IA procesará los documentos.',
      estimatedTime: '2-5 minutos',
      contractAddress: process.env.CONTRACT_ADDRESS,
      note: 'Una vez procesada, la verificación se registrará en el smart contract',
    });
  } catch (error: any) {
    console.error('Error requesting verification:', error);
    res.status(500).json({
      error: 'Error al solicitar verificación',
      message: error.message,
    });
  }
});

export { router as verificationRouter };

