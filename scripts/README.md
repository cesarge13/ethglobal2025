# 📜 Scripts Directory

This directory contains all deployment, testing, and utility scripts for the Agentic Agricultural Validation System.

---

## 📋 Available Scripts

### 🚀 Setup & Deployment

#### `setup-project.sh`
Complete project setup script. Installs all dependencies, compiles all components, and sets up environment files.

```bash
./scripts/setup-project.sh
```

**What it does:**
- ✅ Checks Node.js version (requires 18+)
- ✅ Installs root dependencies
- ✅ Installs smart-contracts dependencies
- ✅ Installs backend dependencies
- ✅ Installs agent dependencies
- ✅ Creates .env.example files
- ✅ Compiles smart contracts
- ✅ Builds backend
- ✅ Builds agent

#### `deploy-all.sh`
Deploys all components of the system.

```bash
./scripts/deploy-all.sh
```

**What it does:**
- ✅ Deploys smart contract (or uses existing)
- ✅ Updates backend .env with contract address
- ✅ Updates agent .env with contract address
- ✅ Builds backend
- ✅ Builds agent
- ✅ Builds frontend
- ✅ Verifies deployment

#### `setup-env.sh`
Interactive script to set up environment variables for all components.

```bash
./scripts/setup-env.sh
```

**What it does:**
- ✅ Prompts for Polygon RPC URL
- ✅ Prompts for Contract Address
- ✅ Prompts for Private Key (optional)
- ✅ Prompts for PolygonScan API Key (optional)
- ✅ Prompts for OpenAI API Key (optional)
- ✅ Creates .env files for all components

---

### 🧪 Testing

#### `test-all.sh`
Runs all tests: compilation, builds, and endpoint tests.

```bash
./scripts/test-all.sh
```

**What it tests:**
- ✅ Smart contract compilation
- ✅ Backend compilation
- ✅ Agent compilation
- ✅ Frontend build
- ✅ Contract deployment (if .env exists)
- ✅ Backend health (if running)
- ✅ Backend endpoints (if running)
- ✅ Deployment verification

#### `test-endpoints.sh`
Tests backend API endpoints using curl.

```bash
./scripts/test-endpoints.sh
```

**What it tests:**
- ✅ Health check endpoint
- ✅ Upload docs endpoint
- ✅ Request verification endpoint
- ✅ Execute x402 payment endpoint
- ✅ Update reputation endpoint
- ✅ Generate report endpoint
- ✅ Get user status endpoint

**Note**: Requires backend to be running on `http://localhost:3001`

---

### 🔍 TypeScript Testing Scripts

#### `test-contract.ts`
Tests smart contract deployment and read functions.

```bash
tsx scripts/test-contract.ts
```

**What it tests:**
- ✅ Contract is deployed at configured address
- ✅ Contract code is accessible
- ✅ Can read contract owner
- ✅ Can call getFarmerInfo function

#### `test-backend.ts`
Tests backend API endpoints programmatically.

```bash
tsx scripts/test-backend.ts
```

**What it tests:**
- ✅ Backend health endpoint
- ✅ x402 rates endpoint
- ✅ User status endpoint
- ✅ Other API endpoints

**Note**: Requires backend to be running

#### `test-integration.ts`
Complete integration testing (end-to-end).

```bash
tsx scripts/test-integration.ts
```

**What it tests:**
- ✅ Contract connection
- ✅ Backend health
- ✅ Backend endpoints
- ✅ Contract read functions
- ✅ Complete integration flow

---

### 🏥 Health & Monitoring

#### `health-check.ts`
Complete health check for all services.

```bash
tsx scripts/health-check.ts
```

**What it checks:**
- ✅ Environment variables
- ✅ Polygon RPC connection
- ✅ Smart contract deployment
- ✅ Backend API health
- ✅ Backend endpoints

**Exit codes:**
- `0` - All services healthy
- `1` - Some services unhealthy

#### `system-status.ts`
Shows complete system status overview.

```bash
tsx scripts/system-status.ts
```

**What it shows:**
- 📋 Smart contract information
- 🚀 Deployment info
- 🔨 Build status
- ⚙️ Environment configuration
- 🔗 Quick links
- 💡 Recommendations

---

### 🔧 Utilities

#### `check-wallet.ts`
Checks wallet balance and information.

```bash
tsx scripts/check-wallet.ts
```

**What it checks:**
- ✅ Wallet address
- ✅ MATIC balance
- ✅ Network connection

#### `verify-deploy-setup.ts`
Verifies deployment setup before deploying.

```bash
tsx scripts/verify-deploy-setup.ts
```

**What it verifies:**
- ✅ Environment variables
- ✅ Wallet balance
- ✅ Network connection
- ✅ Contract compilation

#### `verify-deployment.ts`
Verifies that deployment is complete and correct.

```bash
tsx scripts/verify-deployment.ts
```

**What it verifies:**
- ✅ Environment variables
- ✅ Contract deployment
- ✅ Contract ABI exists
- ✅ Deployment info exists
- ✅ Backend build exists
- ✅ Agent build exists

#### `deploy-contract.ts`
Deploys the smart contract to Polygon Mainnet.

```bash
tsx scripts/deploy-contract.ts
```

**What it does:**
- ✅ Compiles contract
- ✅ Deploys to Polygon Mainnet
- ✅ Saves deployment info
- ✅ Verifies deployment

---

## 📖 Usage Examples

### Complete Setup Flow

```bash
# 1. Setup project
./scripts/setup-project.sh

# 2. Configure environment
./scripts/setup-env.sh

# 3. Deploy contract (or use existing)
./scripts/deploy-all.sh

# 4. Verify deployment
tsx scripts/verify-deployment.ts

# 5. Check health
tsx scripts/health-check.ts

# 6. Run tests
./scripts/test-all.sh
```

### Development Workflow

```bash
# Start backend
cd backend && npm run dev

# In another terminal, test endpoints
tsx scripts/test-backend.ts

# Check system status
tsx scripts/system-status.ts

# Run integration tests
tsx scripts/test-integration.ts
```

### Production Deployment

```bash
# Deploy all components
./scripts/deploy-all.sh

# Verify deployment
tsx scripts/verify-deployment.ts

# Health check
tsx scripts/health-check.ts

# Monitor status
tsx scripts/system-status.ts
```

---

## 🔧 Script Requirements

### Bash Scripts
- Bash shell
- Node.js 18+
- npm

### TypeScript Scripts
- Node.js 18+
- tsx (installed via npm)
- Environment variables configured

---

## 📚 Related Documentation

- [TESTING.md](../TESTING.md) - Complete testing guide
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Complete deployment guide
- [README_ETHGLOBAL.md](../README_ETHGLOBAL.md) - Main project README

---

## 🐛 Troubleshooting

### Scripts Not Executable

```bash
chmod +x scripts/*.sh
```

### TypeScript Scripts Fail

```bash
# Install tsx globally
npm install -g tsx

# Or use npx
npx tsx scripts/health-check.ts
```

### Environment Variables Not Found

Make sure `.env` files exist in:
- `smart-contracts/.env`
- `backend/.env`
- `agent/.env`

Or run `./scripts/setup-env.sh` to create them.

---

**Last Updated**: 2024-01-01

