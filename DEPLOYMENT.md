# 🚀 Deployment Guide - Agentic Agricultural Validation System

Complete deployment guide for all components of the system.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Deployment](#quick-deployment)
3. [Smart Contract Deployment](#smart-contract-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Agent Deployment](#agent-deployment)
6. [Frontend Deployment](#frontend-deployment)
7. [Production Deployment](#production-deployment)
8. [Verification](#verification)
9. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### Required

- Node.js 18+ and npm
- Polygon Mainnet wallet with MATIC for gas
- Git (for cloning repository)

### Optional

- PolygonScan API key (for contract verification)
- OpenAI API key (for advanced LLM features)
- VPS/Cloud server (for production deployment)

### Environment Setup

```bash
# Clone repository
git clone <repository-url>
cd origenmx

# Run setup script
./scripts/setup-project.sh
```

---

## 🚀 Quick Deployment

### One-Command Deployment

```bash
# Deploy all components
./scripts/deploy-all.sh
```

This script:
1. ✅ Deploys smart contract (or uses existing)
2. ✅ Updates backend configuration
3. ✅ Updates agent configuration
4. ✅ Builds all components
5. ✅ Verifies deployment

### Manual Step-by-Step

See sections below for detailed manual deployment.

---

## 📦 Smart Contract Deployment

### Option A: Use Existing Contract (Recommended for Testing)

The contract is already deployed at:
- **Address**: `0x1D645cd86Ad6920132f5fa1081C20A677B854F3D`
- **Network**: Polygon Mainnet
- **PolygonScan**: https://polygonscan.com/address/0x1D645cd86Ad6920132f5fa1081C20A677B854F3D

Just configure your `.env` files with this address.

### Option B: Deploy New Contract

#### 1. Configure Environment

```bash
cd smart-contracts
cp .env.example .env
```

Edit `.env`:
```env
PRIVATE_KEY=your_private_key_here
POLYGON_RPC_URL=https://polygon-rpc.com
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

#### 2. Deploy Contract

```bash
cd smart-contracts
npm install
npm run compile
npm run deploy:polygon
```

Or use the deployment script:
```bash
cd smart-contracts
tsx ../scripts/deploy-contract.ts
```

#### 3. Verify Contract (Optional)

```bash
cd smart-contracts
npx hardhat verify --network polygon <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

#### 4. Save Deployment Info

The deployment script automatically saves to `deployments/polygon-mainnet.json`:

```json
{
  "contractAddress": "0x...",
  "deployedAt": "2024-01-01T00:00:00.000Z",
  "network": "polygon-mainnet"
}
```

---

## 🔌 Backend Deployment

### Local Development

#### 1. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=3001
NODE_ENV=development
POLYGON_RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=0x1D645cd86Ad6920132f5fa1081C20A677B854F3D

# Optional: For write operations
PRIVATE_KEY=your_private_key_here

# Optional: For LLM features
OPENAI_API_KEY=your_openai_api_key
```

#### 2. Install Dependencies

```bash
cd backend
npm install
```

#### 3. Build

```bash
npm run build
```

#### 4. Start Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

Backend runs on `http://localhost:3001`

### Production Deployment

#### Option A: PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start dist/index.js --name agricultural-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Option B: Docker

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

Build and run:
```bash
docker build -t agricultural-backend ./backend
docker run -p 3001:3001 --env-file backend/.env agricultural-backend
```

#### Option C: VPS/Cloud Server

1. **Upload code** to server
2. **Install Node.js** 18+
3. **Configure environment** variables
4. **Build and start**:
   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```
5. **Use reverse proxy** (nginx) for HTTPS
6. **Setup process manager** (PM2, systemd)

---

## 🤖 Agent Deployment

### Local Development

#### 1. Configure Environment

```bash
cd agent
cp .env.example .env
```

Edit `.env`:
```env
POLYGON_RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=0x1D645cd86Ad6920132f5fa1081C20A677B854F3D
AGENT_PRIVATE_KEY=your_agent_private_key_here
OPENAI_API_KEY=your_openai_api_key
```

#### 2. Install Dependencies

```bash
cd agent
npm install
```

#### 3. Build

```bash
npm run build
```

#### 4. Run Agent

```bash
# Generate report
npm run agent report 0x<farmer_address>

# Validate document
npm run agent validate 0x<farmer_address> <document_path>

# Process documents
npm run agent process 0x<farmer_address> <documents_folder>
```

### Production Deployment

The agent can run as:
- **CLI tool**: Run on-demand
- **Background service**: Continuous monitoring
- **Cron job**: Scheduled execution

#### As Background Service

```bash
# Using PM2
cd agent
pm2 start dist/index.js --name agricultural-agent

# Or using systemd (create service file)
```

---

## 🎨 Frontend Deployment

### Local Development

#### 1. Configure Environment

```bash
# Create .env in project root
echo "VITE_API_URL=http://localhost:3001" > .env
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Start Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### Production Build

#### 1. Build for Production

```bash
npm run build
```

This creates `build/` folder with optimized production files.

#### 2. Deploy Options

**Option A: Static Hosting (Vercel, Netlify, GitHub Pages)**

```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=build
```

**Option B: Nginx**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Option C: Docker**

Create `Dockerfile`:
```dockerfile
FROM nginx:alpine
COPY build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t agricultural-frontend .
docker run -p 80:80 agricultural-frontend
```

---

## 🏭 Production Deployment

### Complete Production Setup

#### 1. Infrastructure

- **Smart Contract**: Already deployed on Polygon Mainnet
- **Backend**: VPS/Cloud server (AWS, DigitalOcean, etc.)
- **Frontend**: Static hosting (Vercel, Netlify) or CDN
- **Agent**: Same server as backend or separate

#### 2. Environment Variables

**Backend (.env)**:
```env
PORT=3001
NODE_ENV=production
POLYGON_RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=0x1D645cd86Ad6920132f5fa1081C20A677B854F3D
PRIVATE_KEY=your_production_private_key
OPENAI_API_KEY=your_openai_api_key
```

**Frontend (.env.production)**:
```env
VITE_API_URL=https://api.your-domain.com
```

#### 3. Security Checklist

- [ ] Use HTTPS for all services
- [ ] Set up CORS properly
- [ ] Use environment variables (never commit secrets)
- [ ] Enable rate limiting
- [ ] Use secure private key storage
- [ ] Enable logging and monitoring
- [ ] Set up backups
- [ ] Use firewall rules
- [ ] Enable SSL/TLS certificates

#### 4. Monitoring

- **Health Checks**: `tsx scripts/health-check.ts`
- **Logs**: PM2 logs or systemd journal
- **Metrics**: Set up monitoring (Prometheus, Grafana)
- **Alerts**: Configure alerts for failures

---

## ✅ Verification

### Verify Deployment

```bash
# Run verification script
tsx scripts/verify-deployment.ts
```

This checks:
- ✅ Environment variables configured
- ✅ Contract deployed and accessible
- ✅ Contract ABI exists
- ✅ Deployment info exists
- ✅ Backend built
- ✅ Agent built

### Health Check

```bash
# Check all services
tsx scripts/health-check.ts
```

### System Status

```bash
# View complete system status
tsx scripts/system-status.ts
```

### Manual Verification

1. **Contract**: Check on PolygonScan
   - https://polygonscan.com/address/0x1D645cd86Ad6920132f5fa1081C20A677B854F3D

2. **Backend**: Check health endpoint
   ```bash
   curl https://api.your-domain.com/health
   ```

3. **Frontend**: Open in browser
   - https://your-domain.com

4. **Agent**: Run test command
   ```bash
   cd agent
   npm run agent report 0x<test_address>
   ```

---

## 🐛 Troubleshooting

### Contract Deployment Issues

**Problem**: Deployment fails with "insufficient funds"

**Solution**: Ensure wallet has enough MATIC for gas fees

**Problem**: Contract verification fails

**Solution**: Check constructor arguments match deployment

### Backend Issues

**Problem**: Backend won't start

**Solution**:
```bash
# Check port availability
lsof -i :3001

# Check environment variables
cat backend/.env

# Check logs
cd backend && npm run dev
```

**Problem**: Cannot connect to contract

**Solution**: Verify CONTRACT_ADDRESS and POLYGON_RPC_URL are correct

### Frontend Issues

**Problem**: Build fails

**Solution**:
```bash
# Clean and rebuild
rm -rf node_modules build
npm install
npm run build
```

**Problem**: API calls fail

**Solution**: Check VITE_API_URL matches backend URL

### Agent Issues

**Problem**: Agent cannot process documents

**Solution**: Check OPENAI_API_KEY is set and valid

**Problem**: Agent cannot sign transactions

**Solution**: Verify AGENT_PRIVATE_KEY is set and has MATIC

---

## 📚 Additional Resources

- [README_ETHGLOBAL.md](./README_ETHGLOBAL.md) - Complete project documentation
- [TESTING.md](./TESTING.md) - Testing guide
- [BACKEND_CONECTADO.md](./BACKEND_CONECTADO.md) - Backend integration details

---

## 🔗 Quick Links

- **Contract**: https://polygonscan.com/address/0x1D645cd86Ad6920132f5fa1081C20A677B854F3D
- **Backend API**: http://localhost:3001 (local) / https://api.your-domain.com (production)
- **Frontend**: http://localhost:3000 (local) / https://your-domain.com (production)

---

**Last Updated**: 2024-01-01
