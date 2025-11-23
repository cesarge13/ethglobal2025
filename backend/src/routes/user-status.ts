import express from 'express';
import { ethers } from 'ethers';
import contractService from '../services/contract';

const router = express.Router();

/**
 * GET /api/get-user-status/:address
 * Obtiene el estado completo del usuario/agricultor desde el smart contract
 * 
 * Params:
 * - address: Dirección del agricultor
 */
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;

    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Dirección inválida' });
    }

    // Obtener información del agricultor desde el contrato
    const farmerInfo = await contractService.getFarmerInfo(address);
    const documents = await contractService.getFarmerDocuments(address);
    const verifications = await contractService.getFarmerVerifications(address);
    const certifications = await contractService.getFarmerCertifications(address);

    const status = {
      address: farmerInfo.farmerAddress,
      farmerId: farmerInfo.farmerId,
      isRegistered: farmerInfo.isRegistered,
      reputationScore: farmerInfo.reputationScore,
      totalVerifications: farmerInfo.totalVerifications,
      validCertifications: farmerInfo.validCertifications,
      registrationDate: farmerInfo.registrationDate,
      documents,
      verifications,
      certifications,
      lastUpdate: new Date().toISOString(),
    };

    res.json({
      success: true,
      status,
      contractAddress: process.env.CONTRACT_ADDRESS,
      polygonScanUrl: `https://polygonscan.com/address/${address}`,
    });
  } catch (error: any) {
    console.error('Error getting user status:', error);
    
    // Si el error es que el agricultor no está registrado, devolver información básica
    if (error.message.includes('not registered') || error.message.includes('Farmer not registered')) {
      return res.json({
        success: true,
        status: {
          address: req.params.address,
          isRegistered: false,
          reputationScore: 0,
          totalVerifications: 0,
          validCertifications: 0,
          documents: [],
          verifications: [],
          certifications: [],
          lastUpdate: new Date().toISOString(),
        },
        message: 'Agricultor no registrado en el contrato',
      });
    }

    res.status(500).json({
      error: 'Error al obtener estado del usuario',
      message: error.message,
    });
  }
});

export { router as userStatusRouter };

