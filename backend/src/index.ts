import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { uploadDocsRouter } from './routes/upload-docs';
import { verificationRouter } from './routes/verification';
import { paymentRouter } from './routes/payment';
import { reputationRouter } from './routes/reputation';
import { reportRouter } from './routes/report';
import { userStatusRouter } from './routes/user-status';
import { llmWalletRouter } from './routes/llm-wallet';
import { autopayRouter } from './routes/autopay';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - API information
app.get('/', (req, res) => {
  res.json({
    name: 'Agricultural Validation API',
    version: '1.0.0',
    network: 'polygon-mainnet',
    chainId: 137,
    status: 'running',
    endpoints: {
      health: 'GET /health',
      uploadDocs: 'POST /api/upload-docs',
      requestVerification: 'POST /api/request-verification',
      executePayment: 'POST /api/execute-x402-payment',
      batchPayments: 'POST /api/execute-x402-payment/batch',
      paymentBalance: 'GET /api/x402-balance',
      paymentRates: 'GET /api/x402-rates',
      updateReputation: 'POST /api/update-reputation',
      generateReport: 'POST /api/generate-report',
      getUserStatus: 'GET /api/get-user-status/:address',
      llmWalletContext: 'GET /api/llm-wallet/:agentId/context',
      llmWalletBalance: 'GET /api/llm-wallet/:agentId/balance',
      llmWalletSign: 'POST /api/llm-wallet/:agentId/sign',
      llmWalletVerify: 'POST /api/llm-wallet/verify',
      llmWalletList: 'GET /api/llm-wallet/list',
      autopayRules: 'GET /api/autopay/rules',
      createAutopayRule: 'POST /api/autopay/rules',
      updateAutopayRule: 'PUT /api/autopay/rules/:ruleId',
      deleteAutopayRule: 'DELETE /api/autopay/rules/:ruleId',
      autopayStats: 'GET /api/autopay/stats',
    },
    documentation: 'See PROJECT_README.md for full documentation',
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    network: 'polygon-mainnet',
    chainId: 137,
  });
});

// Routes
app.use('/api/upload-docs', uploadDocsRouter);
app.use('/api/request-verification', verificationRouter);
app.use('/api/execute-x402-payment', paymentRouter);
app.use('/api', paymentRouter); // Para rutas /api/x402-balance y /api/x402-rates
app.use('/api/update-reputation', reputationRouter);
app.use('/api/generate-report', reportRouter);
app.use('/api/get-user-status', userStatusRouter);
app.use('/api/llm-wallet', llmWalletRouter);
app.use('/api/autopay', autopayRouter);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`🌐 Polygon Mainnet (Chain ID: 137)`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   GET  /health`);
  console.log(`   POST /api/upload-docs`);
  console.log(`   POST /api/request-verification`);
  console.log(`   POST /api/execute-x402-payment`);
  console.log(`   POST /api/execute-x402-payment/batch`);
  console.log(`   GET  /api/x402-balance`);
  console.log(`   GET  /api/x402-rates`);
  console.log(`   POST /api/update-reputation`);
  console.log(`   POST /api/generate-report`);
  console.log(`   GET  /api/get-user-status/:address`);
  console.log(`   GET  /api/llm-wallet/:agentId/context`);
  console.log(`   GET  /api/llm-wallet/:agentId/balance`);
  console.log(`   POST /api/llm-wallet/:agentId/sign`);
  console.log(`   POST /api/llm-wallet/verify`);
  console.log(`   GET  /api/llm-wallet/list`);
  console.log(`   GET  /api/autopay/rules`);
  console.log(`   POST /api/autopay/rules`);
  console.log(`   PUT  /api/autopay/rules/:ruleId`);
  console.log(`   DELETE /api/autopay/rules/:ruleId`);
  console.log(`   GET  /api/autopay/stats`);
});

