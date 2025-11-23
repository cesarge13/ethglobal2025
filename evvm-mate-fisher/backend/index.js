import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerEvent } from './services/executor.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'EVVM MATE Fisher Backend - Polygon Mainnet' });
});

// Endpoint principal: Registrar evento en MATE EVVM
app.post('/registerEvent', async (req, res) => {
  try {
    const { lotId, eventType } = req.body;

    // Validar que lleguen los campos requeridos
    if (!lotId || !eventType) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'lotId y eventType son requeridos',
        received: { lotId, eventType }
      });
    }

    // Validar que eventType sea válido
    const validEventTypes = ['HARVEST', 'SHIPPED', 'STORAGE'];
    if (!validEventTypes.includes(eventType)) {
      return res.status(400).json({
        error: 'eventType inválido',
        message: `eventType debe ser uno de: ${validEventTypes.join(', ')}`,
        received: eventType
      });
    }

    console.log(`📝 Registrando evento: ${eventType} para lotId: ${lotId}`);

    // Registrar el evento en MATE EVVM
    const result = await registerEvent(lotId, eventType);

    res.json({
      success: true,
      message: 'Evento registrado exitosamente en MATE EVVM (Polygon Mainnet)',
      data: {
        lotId,
        eventType,
        timestamp: result.timestamp,
        txHash: result.txHash,
        evvmId: 2,
        explorerUrl: `https://polygonscan.com/tx/${result.txHash}`
      }
    });

  } catch (error) {
    console.error('❌ Error registrando evento:', error);
    res.status(500).json({
      error: 'Error al registrar evento',
      message: error.message,
      details: error.stack
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 EVVM MATE Fisher Backend corriendo en http://localhost:${PORT}`);
  console.log(`🌐 Red: Polygon Mainnet`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET  /health`);
  console.log(`   POST /registerEvent`);
});
