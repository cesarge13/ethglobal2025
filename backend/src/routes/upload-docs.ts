import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ethers } from 'ethers';
import crypto from 'crypto';
import contractService from '../services/contract';

const router = express.Router();

// Configurar multer para almacenar archivos
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo PDF e imágenes.'));
    }
  },
});

/**
 * POST /api/upload-docs
 * Endpoint para subir documentos agrícolas
 * 
 * Body:
 * - files: Archivos (PDF, imágenes)
 * - farmerAddress: Dirección del agricultor
 * - docType: Tipo de documento (identity, certification, warehouse, crop)
 */
router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    const { farmerAddress, docType } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!farmerAddress) {
      return res.status(400).json({ error: 'farmerAddress es requerido' });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron archivos' });
    }

    if (!ethers.isAddress(farmerAddress)) {
      return res.status(400).json({ error: 'Dirección inválida' });
    }

    // Procesar archivos y registrar en el contrato
    const uploadedDocs = [];
    
    for (const file of files) {
      // Leer el archivo y generar hash SHA256
      const fileBuffer = fs.readFileSync(file.path);
      const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      
      // Tipo de documento válido
      const validDocType = docType || 'unknown';
      const allowedTypes = ['identity', 'certification', 'warehouse', 'crop', 'unknown'];
      const finalDocType = allowedTypes.includes(validDocType) ? validDocType : 'unknown';

      try {
        console.log(`📄 Procesando documento: ${file.originalname}`);
        console.log(`🔐 Firmando transacción con wallet del backend...`);
        
        // Registrar documento en el smart contract
        const txHash = await contractService.registerDocument(farmerAddress, fileHash, finalDocType);
        
        console.log(`✅ Transacción enviada: ${txHash}`);
        console.log(`🔗 PolygonScan: https://polygonscan.com/tx/${txHash}`);
        
        uploadedDocs.push({
          filename: file.originalname,
          hash: fileHash,
          path: file.path,
          type: finalDocType,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          txHash,
          polygonScanUrl: `https://polygonscan.com/tx/${txHash}`,
          registered: true,
        });
      } catch (error: any) {
        console.error(`❌ Error registrando documento ${file.originalname}:`, error);
        console.error(`   Mensaje: ${error.message}`);
        console.error(`   Stack: ${error.stack}`);
        
        // Mensaje de error más descriptivo
        let errorMessage = error.message;
        if (error.message.includes('PRIVATE_KEY')) {
          errorMessage = 'PRIVATE_KEY no configurada en el backend. El backend necesita una clave privada para firmar transacciones en blockchain.';
        } else if (error.message.includes('insufficient funds') || error.message.includes('gas')) {
          errorMessage = 'Fondos insuficientes para pagar gas. El wallet del backend necesita MATIC.';
        } else if (error.message.includes('nonce')) {
          errorMessage = 'Error de nonce. Intenta de nuevo en unos segundos.';
        }
        
        uploadedDocs.push({
          filename: file.originalname,
          hash: fileHash,
          path: file.path,
          type: finalDocType,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          registered: false,
          error: errorMessage,
        });
      }
    }

    // TODO: Enviar a agente IA para procesamiento
    // TODO: Guardar en base de datos

    const registeredCount = uploadedDocs.filter(d => d.registered).length;
    const failedCount = uploadedDocs.filter(d => !d.registered).length;
    
    // Mensaje más descriptivo
    let message = '';
    if (registeredCount === files.length) {
      message = `✅ ${registeredCount} documento(s) registrado(s) exitosamente en blockchain.`;
    } else if (registeredCount > 0) {
      message = `⚠️ ${registeredCount} documento(s) registrado(s), ${failedCount} fallido(s).`;
    } else {
      message = `❌ No se pudieron registrar los documentos. Verifica la configuración del backend.`;
    }
    
    res.json({
      success: registeredCount > 0,
      message,
      documents: uploadedDocs,
      farmerAddress,
      contractAddress: process.env.CONTRACT_ADDRESS,
      registeredCount,
      failedCount,
      needsPrivateKey: failedCount > 0 && uploadedDocs.some(d => d.error && d.error.includes('PRIVATE_KEY')),
    });
  } catch (error: any) {
    console.error('Error uploading docs:', error);
    res.status(500).json({
      error: 'Error al subir documentos',
      message: error.message,
    });
  }
});

export { router as uploadDocsRouter };

