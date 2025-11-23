# 🧪 Testing Guide - Agentic Agricultural Validation System

Complete testing guide for all components of the system.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Testing Smart Contracts](#testing-smart-contracts)
3. [Testing Backend](#testing-backend)
4. [Testing Agent](#testing-agent)
5. [Testing Frontend](#testing-frontend)
6. [Integration Testing](#integration-testing)
7. [End-to-End Testing](#end-to-end-testing)
8. [Health Checks](#health-checks)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Run All Tests

```bash
# Run complete test suite
./scripts/test-all.sh

# Or run individual test scripts
tsx scripts/test-contract.ts
tsx scripts/test-backend.ts
tsx scripts/test-integration.ts
tsx scripts/health-check.ts
```

### Prerequisites

- Node.js 18+
- All dependencies installed (`./scripts/setup-project.sh`)
- Environment variables configured
- Backend running (for API tests)

---

## 📦 Testing Smart Contracts

### Compile Contracts

```bash
cd smart-contracts
npm run compile
```

### Test Contract Deployment

```bash
# Test if contract is deployed and accessible
tsx scripts/test-contract.ts
```

This script checks:
- ✅ Contract is deployed at configured address
- ✅ Contract code is accessible
- ✅ Can read contract owner
- ✅ Can call view functions

### Manual Contract Testing

```bash
cd smart-contracts

# Connect to contract via Hardhat console
npx hardhat console --network polygon

# In console:
const contract = await ethers.getContractAt("AgriculturalReputation", "0x1D645cd86Ad6920132f5fa1081C20A677B854F3D");
await contract.owner();
await contract.getFarmerInfo("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
```

### Verify Contract on PolygonScan

```bash
cd smart-contracts
npx hardhat verify --network polygon <CONTRACT_ADDRESS>
```

---

## 🔌 Testing Backend

### Start Backend

```bash
cd backend
npm run dev
```

Backend should start on `http://localhost:3001`

### Health Check

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "contract": {
    "address": "0x1D645cd86Ad6920132f5fa1081C20A677B854F3D",
    "network": "Polygon Mainnet"
  }
}
```

### Test Backend Endpoints

#### Automated Testing

```bash
# Run backend test script
tsx scripts/test-backend.ts

# Or use endpoint test script
./scripts/test-endpoints.sh
```

#### Manual Testing

**1. Get User Status**
```bash
curl http://localhost:3001/api/get-user-status/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

**2. Get x402 Rates**
```bash
curl http://localhost:3001/api/x402-rates
```

**3. Update Reputation** (requires PRIVATE_KEY)
```bash
curl -X POST http://localhost:3001/api/update-reputation \
  -H "Content-Type: application/json" \
  -d '{
    "farmerAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "newScore": 85
  }'
```

**4. Upload Documents**
```bash
curl -X POST http://localhost:3001/api/upload-docs \
  -F "files=@document.pdf" \
  -F "farmerAddress=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" \
  -F "docType=identity"
```

**5. Request Verification**
```bash
curl -X POST http://localhost:3001/api/request-verification \
  -H "Content-Type: application/json" \
  -d '{
    "farmerAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "documentHashes": ["hash1", "hash2"]
  }'
```

**6. Execute x402 Payment**
```bash
curl -X POST http://localhost:3001/api/execute-x402-payment \
  -H "Content-Type: application/json" \
  -d '{
    "farmerAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "amount": "0.001",
    "action": "document_validation"
  }'
```

### Backend Build Test

```bash
cd backend
npm run build
# Check dist/ folder exists
ls dist/
```

---

## 🤖 Testing Agent

### Build Agent

```bash
cd agent
npm run build
```

### Test Agent CLI

**Generate Report**
```bash
cd agent
npm run agent report 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

**Validate Document**
```bash
cd agent
npm run agent validate 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb test-docs/sample-identity.txt
```

**Process Documents**
```bash
cd agent
npm run agent process 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb test-docs/
```

### Agent Service Tests

The agent uses:
- Document processor (PDF, images)
- LLM service (OpenAI GPT-4o-mini)
- Blockchain service (ethers.js)

Test each service individually by checking logs during agent execution.

---

## 🎨 Testing Frontend

### Build Frontend

```bash
npm run build
```

Check `build/` folder exists with:
- `index.html`
- `assets/` folder with JS/CSS files

### Start Development Server

```bash
npm run dev
```

Frontend should start on `http://localhost:3000`

### Manual Frontend Testing

1. **Open Browser**: Navigate to `http://localhost:3000`
2. **Connect Wallet**: Use MetaMask or RainbowKit
3. **Switch to Polygon Mainnet**: Chain ID 137
4. **Test Features**:
   - View dashboard
   - Upload documents
   - View reputation score
   - Request verification
   - View verification history

### Frontend Build Verification

```bash
# Build and verify
npm run build
ls -la build/
# Should see index.html and assets/
```

---

## 🔗 Integration Testing

### Run Integration Tests

```bash
# Complete integration test suite
tsx scripts/test-integration.ts
```

This tests:
- ✅ Contract connection
- ✅ Backend health
- ✅ Backend endpoints
- ✅ Contract read functions
- ✅ End-to-end flow

### Integration Test Flow

1. **Contract Connection**: Verify contract is deployed and accessible
2. **Backend Health**: Check backend is running
3. **Backend Endpoints**: Test all API endpoints
4. **Contract Functions**: Test contract read operations
5. **End-to-End**: Test complete validation workflow

---

## 🏥 Health Checks

### System Health Check

```bash
tsx scripts/health-check.ts
```

Checks:
- ✅ Environment variables
- ✅ Polygon RPC connection
- ✅ Smart contract deployment
- ✅ Backend API health
- ✅ Backend endpoints

### System Status

```bash
tsx scripts/system-status.ts
```

Shows:
- Contract information
- Deployment status
- Build status
- Environment configuration
- Quick links

---

## 🔄 End-to-End Testing

### Complete Validation Flow

1. **Start Services**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend
   npm run dev
   ```

2. **Register Farmer** (via contract or backend)
   ```bash
   # Use MetaMask or backend API
   ```

3. **Upload Documents** (via frontend or API)
   ```bash
   curl -X POST http://localhost:3001/api/upload-docs \
     -F "files=@document.pdf" \
     -F "farmerAddress=0x..." \
     -F "docType=identity"
   ```

4. **Request Verification** (via frontend or API)
   ```bash
   curl -X POST http://localhost:3001/api/request-verification \
     -H "Content-Type: application/json" \
     -d '{"farmerAddress": "0x...", "documentHashes": ["hash1"]}'
   ```

5. **Run Agent Validation**
   ```bash
   cd agent
   npm run agent report 0x...
   ```

6. **Check Reputation Update**
   ```bash
   curl http://localhost:3001/api/get-user-status/0x...
   ```

7. **Verify on Blockchain**
   - Check PolygonScan for transactions
   - Verify reputation score updated
   - Check x402 payments logged

---

## 🐛 Troubleshooting

### Common Issues

#### Contract Not Deployed

**Error**: `Contract not deployed at address`

**Solution**:
```bash
# Deploy contract
cd smart-contracts
npm run deploy:polygon

# Or use existing contract
export CONTRACT_ADDRESS=0x1D645cd86Ad6920132f5fa1081C20A677B854F3D
```

#### Backend Not Starting

**Error**: `Cannot connect to database` or `Port already in use`

**Solution**:
```bash
# Check if port is in use
lsof -i :3001

# Kill process if needed
kill -9 <PID>

# Check environment variables
cat backend/.env
```

#### RPC Connection Failed

**Error**: `RPC connection failed`

**Solution**:
```bash
# Try different RPC endpoint
export POLYGON_RPC_URL=https://polygon-rpc.com
# Or
export POLYGON_RPC_URL=https://rpc.ankr.com/polygon
```

#### Build Failures

**Error**: `Build failed`

**Solution**:
```bash
# Clean and rebuild
rm -rf node_modules dist build
npm install
npm run build
```

### Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=* npm run dev

# Agent
DEBUG=* npm run agent report 0x...
```

### Check Logs

```bash
# Backend logs
cd backend
npm run dev  # Check console output

# Agent logs
cd agent
npm run agent report 0x...  # Check console output
```

---

## 📊 Test Coverage

### Current Coverage

- ✅ Smart Contract: Deployment, Read Functions
- ✅ Backend: All API Endpoints
- ✅ Agent: CLI Commands, Document Processing
- ✅ Frontend: Build Verification
- ✅ Integration: End-to-End Flow

### Missing Coverage

- ⏳ Unit Tests for Services
- ⏳ Contract Write Function Tests (requires PRIVATE_KEY)
- ⏳ Frontend Component Tests
- ⏳ E2E Tests with Playwright/Cypress

---

## 🎯 Test Checklist

Before submitting to ETHGlobal:

- [ ] All smart contracts compile
- [ ] Contract deployed and verified on PolygonScan
- [ ] Backend starts and health check passes
- [ ] All backend endpoints respond correctly
- [ ] Agent CLI commands work
- [ ] Frontend builds successfully
- [ ] Integration tests pass
- [ ] Health check shows all services healthy
- [ ] End-to-end flow works completely
- [ ] Documentation is up to date

---

## 📚 Additional Resources

- [README_ETHGLOBAL.md](./README_ETHGLOBAL.md) - Complete project documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [BACKEND_CONECTADO.md](./BACKEND_CONECTADO.md) - Backend integration details

---

**Last Updated**: 2024-01-01
