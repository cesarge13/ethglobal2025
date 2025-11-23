# 🌾 Agentic Agricultural Validation System with x402 Micropayments

> **ETHGlobal Hackathon Project** | Polygon Mainnet | x402 Micropayments | LLM Wallet MCP | AutoPay Extension

A complete agentic agricultural validation system deployed on **Polygon Mainnet** where an AI agent analyzes agricultural documentation and executes x402 micropayments for each validation action.

---

## 🎯 Project Overview

This system enables:
- 🤖 **AI Agent** analyzes agricultural documentation, certifications, and producer data in Mexico
- 💰 **x402 Micropayments** executed automatically on Polygon Mainnet for each validation
- 📊 **On-chain Reputation Score** updated via smart contracts
- 🏦 **Credit Access** - Farmers can use reputation for better credit/microcredit terms
- 🔗 **Full Integration** with x402, AutoPay, LLM Wallet MCP, and Polygon agentic modules

---

## 🏆 Key Features

### ✅ Smart Contract (Solidity)
- On-chain agricultural reputation scoring (0-100)
- Document registration with IPFS hashes
- 4-step verification process (Identity, Certifications, Warehouse, Crop)
- Certification management (SAGARPA, SENASICA, Organic, BPA)
- x402 payment logging and events
- Gas-optimized for Polygon Mainnet

### ✅ Backend (TypeScript/Express)
- RESTful API with 15+ endpoints
- Smart contract integration via ethers.js
- Document upload and processing
- x402 micropayment execution
- LLM Wallet MCP integration
- AutoPay Extension for automatic payments
- Real-time reputation updates

### ✅ AI Agent (TypeScript)
- Document processing (PDF, images)
- LLM-powered analysis (OpenAI GPT-4o-mini)
- 4-step validation workflow
- Automatic x402 micropayment execution
- Blockchain transaction signing
- Report generation

### ✅ Frontend (React/Vite)
- Modern dashboard for farmers
- Wallet connection (Wagmi + RainbowKit)
- Document upload interface
- Reputation visualization
- Verification history
- x402 payment management
- Real-time updates

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Polygon Mainnet wallet with MATIC
- (Optional) OpenAI API key for advanced LLM analysis

### 1. Clone and Install

```bash
git clone <repository-url>
cd origenmx

# Quick setup (recommended) - installs all dependencies, compiles, sets up env
./scripts/setup-project.sh

# Or manual setup
npm install
cd smart-contracts && npm install && cd ..
cd backend && npm install && cd ..
cd agent && npm install && cd ..
```

**💡 Tip**: Use `./scripts/setup-project.sh` for automatic setup. It handles everything!

### 2. Smart Contract Deployment

**Option A: Use Already Deployed Contract (Recommended for Testing)**

The contract is already deployed at:
- **Address:** `0x1D645cd86Ad6920132f5fa1081C20A677B854F3D`
- **PolygonScan:** https://polygonscan.com/address/0x1D645cd86Ad6920132f5fa1081C20A677B854F3D

Just configure your `.env` files with this address.

**Option B: Deploy New Contract**

```bash
cd smart-contracts
npm install

# Configure environment
cp .env.example .env
# Edit .env with:
# - PRIVATE_KEY=your_private_key
# - POLYGON_RPC_URL=https://polygon-rpc.com
# - POLYGONSCAN_API_KEY=your_api_key

# Deploy
npm run deploy:polygon
# Or use the deployment script:
cd ..
./scripts/deploy-all.sh

# Verify (optional)
cd smart-contracts
npx hardhat verify --network polygon <CONTRACT_ADDRESS>
```

**Deployed Contract:** `0x1D645cd86Ad6920132f5fa1081C20A677B854F3D`  
**PolygonScan:** https://polygonscan.com/address/0x1D645cd86Ad6920132f5fa1081C20A677B854F3D

### 3. Backend Setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with:
# - PORT=3001
# - POLYGON_RPC_URL=https://polygon-rpc.com
# - CONTRACT_ADDRESS=0x1D645cd86Ad6920132f5fa1081C20A677B854F3D
# - PRIVATE_KEY=your_private_key (for transactions)

# Start backend
npm run dev
```

Backend runs on: `http://localhost:3001`

### 4. AI Agent Setup

```bash
cd agent
npm install

# Configure environment
cp .env.example .env
# Edit .env with:
# - POLYGON_RPC_URL=https://polygon-rpc.com
# - CONTRACT_ADDRESS=0x1D645cd86Ad6920132f5fa1081C20A677B854F3D
# - AGENT_PRIVATE_KEY=your_agent_private_key
# - OPENAI_API_KEY=your_openai_key (optional)

# Test agent
npm run agent report 0x<farmer_address>
```

### 5. Frontend Setup

```bash
# From project root
npm install

# Configure environment
echo "VITE_API_URL=http://localhost:3001" > .env

# Start frontend
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 📁 Project Structure

```
origenmx/
├── smart-contracts/          # Solidity contracts
│   ├── contracts/
│   │   └── AgriculturalReputation.sol
│   ├── deploy.ts            # Deployment script
│   └── hardhat.config.ts
│
├── backend/                  # TypeScript backend
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   │   ├── contract.ts  # Smart contract service
│   │   │   ├── x402.ts      # x402 micropayments
│   │   │   ├── llm-wallet.ts # LLM Wallet MCP
│   │   │   └── autopay.ts   # AutoPay Extension
│   │   └── index.ts
│   └── package.json
│
├── agent/                    # AI Agent
│   ├── src/
│   │   ├── agent.ts         # Main agent
│   │   ├── services/
│   │   │   ├── document-processor.ts
│   │   │   ├── llm-service.ts
│   │   │   └── blockchain-service.ts
│   │   └── cli.ts           # CLI interface
│   └── package.json
│
├── src/                      # React frontend
│   ├── components/
│   │   └── agricultural/   # Agricultural components
│   ├── services/
│   │   └── agriculturalApi.ts
│   └── App.tsx
│
└── scripts/                  # Deployment scripts
    └── deploy-contract.ts
```

---

## 🔌 API Endpoints

### Backend API (`http://localhost:3001`)

#### Health & Info
- `GET /health` - Health check
- `GET /` - API information

#### Farmer Management
- `GET /api/get-user-status/:address` - Get farmer status
- `POST /api/update-reputation` - Update reputation score

#### Documents
- `POST /api/upload-docs` - Upload documents
- `POST /api/request-verification` - Request verification

#### x402 Micropayments
- `POST /api/execute-x402-payment` - Execute micropayment
- `POST /api/execute-x402-payment/batch` - Batch payments
- `GET /api/x402-balance` - Get payment wallet balance
- `GET /api/x402-rates` - Get payment rates

#### LLM Wallet MCP
- `GET /api/llm-wallet/:agentId/context` - Get wallet context
- `GET /api/llm-wallet/:agentId/balance` - Get wallet balance
- `POST /api/llm-wallet/:agentId/sign` - Sign message
- `POST /api/llm-wallet/verify` - Verify signature
- `GET /api/llm-wallet/list` - List wallets

#### AutoPay Extension
- `GET /api/autopay/rules` - List AutoPay rules
- `POST /api/autopay/rules` - Create AutoPay rule
- `PUT /api/autopay/rules/:ruleId` - Update rule
- `DELETE /api/autopay/rules/:ruleId` - Delete rule
- `GET /api/autopay/stats` - Get statistics

---

## 💰 x402 Micropayment Rates

| Action | Rate (MATIC) |
|--------|--------------|
| Document Validation | 0.001 |
| Certification Check | 0.002 |
| Verification Step | 0.0005 |
| Report Generation | 0.003 |

---

## 🔄 Workflow

### Complete Validation Flow

1. **Farmer Uploads Documents**
   - Frontend → Backend API
   - Documents stored locally
   - Hashes registered on-chain

2. **AI Agent Processes**
   - Agent reads documents
   - LLM analyzes content
   - Validates identity, certifications, warehouse, crop

3. **Micropayments Executed**
   - x402 micropayment for each validation step
   - Payments logged on-chain
   - AutoPay rules triggered (if configured)

4. **Reputation Updated**
   - Smart contract updates reputation score
   - Events emitted for frontend
   - Score visible in dashboard

5. **Report Generated**
   - Final validation report
   - All steps documented
   - Reputation score displayed

---

## 🧪 Testing

### Quick Setup & Test

```bash
# Complete setup (installs dependencies, compiles, verifies)
./scripts/setup-project.sh

# Run all tests (compilation, builds, endpoints)
./scripts/test-all.sh

# Complete health check
tsx scripts/health-check.ts

# Integration testing (end-to-end)
tsx scripts/test-integration.ts
```

### Test Smart Contract

```bash
cd smart-contracts
npm run compile

# Test deployed contract
tsx ../scripts/test-contract.ts

# Or check system status
tsx ../scripts/system-status.ts
```

### Test Backend

```bash
cd backend
npm run build
npm run dev  # Start backend

# In another terminal, test endpoints
tsx ../scripts/test-backend.ts
# Or manually:
curl http://localhost:3001/health
curl http://localhost:3001/api/x402-rates
```

### Test Agent

```bash
cd agent
npm run build
npm run agent report 0x<farmer_address>
npm run agent validate 0x<farmer_address> test-docs/sample-identity.txt
```

### Test Frontend

```bash
npm run build  # Verify build
npm run dev    # Start dev server
# Open http://localhost:3000
# Connect wallet (Polygon Mainnet)
# Navigate to "Validación Agrícola"
```

### Verify Deployment

```bash
# Verify all components are properly deployed
tsx scripts/verify-deployment.ts

# Check system status
tsx scripts/system-status.ts

# Health check all services
tsx scripts/health-check.ts
```

**📖 For detailed testing guide, see [TESTING.md](./TESTING.md)**

---

## 📊 Smart Contract Details

**Contract:** `AgriculturalReputation.sol`  
**Address:** `0x1D645cd86Ad6920132f5fa1081C20A677B854F3D`  
**Network:** Polygon Mainnet (Chain ID: 137)  
**Compiler:** Solidity 0.8.20  
**Optimization:** Yes, 200 runs

### Key Functions

- `registerFarmer(address, string)` - Register new farmer
- `updateReputation(address, uint256)` - Update reputation (0-100)
- `registerDocument(address, string, string)` - Register document
- `logVerification(address, uint256, bool, string)` - Log verification
- `addCertification(address, string)` - Add certification
- `logX402Payment(address, uint256, string)` - Log x402 payment

### Events

- `FarmerRegistered`
- `ReputationUpdated`
- `DocumentRegistered`
- `VerificationLogged`
- `CertificationAdded`
- `X402PaymentExecuted`

---

## 🔐 Security Considerations

- ⚠️ **Never commit private keys** - Use environment variables
- ⚠️ **Use multisig** for production owner wallet
- ⚠️ **Validate inputs** on both frontend and backend
- ⚠️ **Rate limiting** recommended for production
- ⚠️ **HTTPS** required for production

---

## 🌐 Network Configuration

### Polygon Mainnet
- **Chain ID:** 137
- **RPC URL:** https://polygon-rpc.com
- **Explorer:** https://polygonscan.com
- **Currency:** MATIC

---

## 📚 Documentation

### Main Documentation
- [**TESTING.md**](./TESTING.md) - Complete testing guide with all test scenarios
- [**DEPLOYMENT.md**](./DEPLOYMENT.md) - Complete deployment guide for all components
- [**README_ETHGLOBAL.md**](./README_ETHGLOBAL.md) - This file (main project README)

### Component Documentation
- [Smart Contract README](./smart-contracts/README.md) - Smart contract details
- [Backend README](./backend/README.md) - Backend API documentation
- [Agent README](./agent/README.md) - AI Agent documentation

### Integration Guides
- [Integration Guide](./INTEGRACION_X402_LLM_AUTOPAY.md) - x402, LLM Wallet, AutoPay integration
- [Backend Connected](./BACKEND_CONECTADO.md) - Backend-Smart Contract integration
- [Deployment Success](./DEPLOYMENT_SUCCESS.md) - Deployment verification

### Scripts Documentation
All scripts are located in `/scripts` directory:
- `setup-project.sh` - Complete project setup
- `deploy-all.sh` - Deploy all components
- `test-all.sh` - Run all tests
- `health-check.ts` - Health check for all services
- `system-status.ts` - System status overview
- `test-integration.ts` - Integration testing
- See [TESTING.md](./TESTING.md) for detailed script usage

## 🛠️ Scripts Available

### Setup & Deployment

```bash
# Complete project setup (installs dependencies, compiles, sets up env)
./scripts/setup-project.sh

# Deploy all components (contract, backend, agent, frontend)
./scripts/deploy-all.sh

# Setup environment variables interactively
./scripts/setup-env.sh

# Verify deployment
tsx scripts/verify-deployment.ts
```

### Testing

```bash
# Run all tests (compilation, builds, endpoints)
./scripts/test-all.sh

# Test contract deployment and functions
tsx scripts/test-contract.ts

# Test backend endpoints
tsx scripts/test-backend.ts

# Test endpoints manually with curl
./scripts/test-endpoints.sh

# Complete integration testing (end-to-end)
tsx scripts/test-integration.ts
```

### Health & Monitoring

```bash
# Complete health check (contract, backend, RPC, endpoints)
tsx scripts/health-check.ts

# System status overview (contract info, builds, environment)
tsx scripts/system-status.ts
```

### Utilities

```bash
# Check wallet balance
tsx scripts/check-wallet.ts

# Verify deployment setup
tsx scripts/verify-deploy-setup.ts
```

---

## 🎓 For ETHGlobal Judges

### What This Demonstrates

✅ **Complete Polygon Integration**
- Smart contract deployed and verified on Polygon Mainnet
- Real transactions on mainnet
- Gas-optimized for Polygon

✅ **x402 Micropayments**
- Real micropayments executed
- Automatic payment execution
- Payment logging on-chain

✅ **Agentic System**
- AI agent processes documents autonomously
- LLM-powered analysis
- Automatic blockchain interactions

✅ **LLM Wallet MCP**
- Agent wallet management
- Message signing and verification
- Transaction execution

✅ **AutoPay Extension**
- Rule-based automatic payments
- Event-driven execution
- Configurable triggers

✅ **On-chain Reputation**
- Reputation scoring system
- Transparent and verifiable
- Useful for DeFi/credit applications

### Technical Highlights

- **Full Stack:** Smart contracts + Backend + Frontend + AI Agent
- **Real Mainnet:** All components deployed on Polygon Mainnet
- **Production Ready:** Error handling, validation, security considerations
- **Well Documented:** Comprehensive READMEs and guides
- **Modern Stack:** TypeScript, React, Solidity, Hardhat

---

## 🛠️ Tech Stack

- **Smart Contracts:** Solidity 0.8.20, Hardhat
- **Backend:** Node.js, TypeScript, Express, ethers.js
- **AI Agent:** TypeScript, OpenAI GPT, pdf-parse
- **Frontend:** React, Vite, Wagmi, RainbowKit, Tailwind CSS
- **Blockchain:** Polygon Mainnet, ethers.js

---

## 📝 License

MIT License

---

## 👥 Team

Built for ETHGlobal Hackathon

---

## 🔗 Links

- **Contract on PolygonScan:** https://polygonscan.com/address/0x1D645cd86Ad6920132f5fa1081C20A677B854F3D
- **Backend API:** http://localhost:3001
- **Frontend:** http://localhost:3000

---

## 🚀 Deployment Status

- ✅ Smart Contract: Deployed & Verified
- ✅ Backend: Ready for deployment
- ✅ Agent: Ready for deployment
- ✅ Frontend: Ready for deployment

---

**🎉 Project Complete and Ready for ETHGlobal Submission!**

