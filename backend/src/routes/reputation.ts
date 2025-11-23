import express from 'express';
import { ethers } from 'ethers';
import contractService from '../services/contract';

const router = express.Router();

/**
 * POST /api/update-reputation
 * Actualiza el score de reputación en el smart contract
 * 
 * Body:
 * - farmerAddress: Dirección del agricultor
 * - newScore: Nuevo score (0-100)
 */
router.post('/', async (req, res) => {
  try {
    const { farmerAddress, newScore } = req.body;

    if (!farmerAddress) {
      return res.status(400).json({ error: 'farmerAddress es requerido' });
    }

    if (!ethers.isAddress(farmerAddress)) {
      return res.status(400).json({ error: 'Dirección inválida' });
    }

    if (newScore === undefined || newScore < 0 || newScore > 100) {
      return res.status(400).json({ error: 'newScore debe ser un número entre 0 y 100' });
    }

    // Obtener el score actual antes de actualizar
    let oldScore = 0;
    try {
      const farmerInfo = await contractService.getFarmerInfo(farmerAddress);
      oldScore = farmerInfo.reputationScore;
    } catch (error: any) {
      // Si el agricultor no está registrado, oldScore será 0
      console.warn('No se pudo obtener el score actual:', error.message);
    }

    // Actualizar la reputación en el contrato
    const txHash = await contractService.updateReputation(farmerAddress, newScore);

    res.json({
      success: true,
      farmerAddress,
      oldScore,
      newScore,
      txHash,
      status: 'confirmed',
      message: 'Reputación actualizada exitosamente en blockchain',
      polygonScanUrl: `https://polygonscan.com/tx/${txHash}`,
      contractAddress: process.env.CONTRACT_ADDRESS,
    });
  } catch (error: any) {
    console.error('Error updating reputation:', error);
    
    // Error específico si no hay PRIVATE_KEY configurada
    if (error.message.includes('PRIVATE_KEY')) {
      return res.status(503).json({
        error: 'PRIVATE_KEY no configurada',
        message: 'Para actualizar la reputación, necesitas configurar PRIVATE_KEY en el archivo .env del backend',
        instructions: [
          '1. Agrega PRIVATE_KEY a backend/.env',
          '2. La clave debe ser del owner del contrato',
          '3. Reinicia el backend'
        ]
      });
    }

    res.status(500).json({
      error: 'Error al actualizar reputación',
      message: error.message,
    });
  }
});

export { router as reputationRouter };

