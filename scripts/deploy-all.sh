#!/bin/bash

# Script para desplegar todos los componentes

set -e

echo "🚀 Deploying Agentic Agricultural Validation System"
echo "===================================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Función para imprimir resultados
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root"
    exit 1
fi

# 1. Deploy Smart Contract
print_step "Step 1: Deploying Smart Contract..."
cd smart-contracts

if [ ! -f ".env" ]; then
    print_warning ".env file not found in smart-contracts/"
    print_warning "Please create .env with PRIVATE_KEY and POLYGON_RPC_URL"
    print_warning "Or use existing contract: 0x1D645cd86Ad6920132f5fa1081C20A677B854F3D"
    read -p "Do you want to use existing contract? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        CONTRACT_ADDRESS="0x1D645cd86Ad6920132f5fa1081C20A677B854F3D"
        print_success "Using existing contract: $CONTRACT_ADDRESS"
        cd ..
    else
        print_error "Cannot proceed without .env file"
        exit 1
    fi
else
    # Verify .env has required variables
    if ! grep -q "PRIVATE_KEY" .env || ! grep -q "POLYGON_RPC_URL" .env; then
        print_error ".env file missing required variables (PRIVATE_KEY, POLYGON_RPC_URL)"
        exit 1
    fi
    
    if npm run deploy:polygon; then
        print_success "Smart contract deployed successfully"
        if [ -f "deployments/polygon-mainnet.json" ]; then
            CONTRACT_ADDRESS=$(cat deployments/polygon-mainnet.json | grep -o '"contractAddress":"[^"]*' | cut -d'"' -f4)
            echo "Contract Address: $CONTRACT_ADDRESS"
        else
            print_error "Deployment file not found. Please check deployment output."
            exit 1
        fi
    else
        print_error "Smart contract deployment failed"
        exit 1
    fi
    cd ..
fi

# 2. Update Backend .env
print_step "Step 2: Updating Backend Configuration..."
cd backend

if [ ! -f ".env" ]; then
    print_warning ".env file not found in backend/"
    print_warning "Creating .env from template..."
    cat > .env << EOF
PORT=3001
NODE_ENV=production
POLYGON_RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=$CONTRACT_ADDRESS
EOF
else
    # Update CONTRACT_ADDRESS if it exists
    if grep -q "CONTRACT_ADDRESS" .env; then
        sed -i.bak "s|CONTRACT_ADDRESS=.*|CONTRACT_ADDRESS=$CONTRACT_ADDRESS|" .env
    else
        echo "CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> .env
    fi
fi

print_success "Backend configuration updated"
cd ..

# 3. Update Agent .env
print_step "Step 3: Updating Agent Configuration..."
cd agent

if [ ! -f ".env" ]; then
    print_warning ".env file not found in agent/"
    print_warning "Creating .env from template..."
    cat > .env << EOF
POLYGON_RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=$CONTRACT_ADDRESS
EOF
else
    # Update CONTRACT_ADDRESS if it exists
    if grep -q "CONTRACT_ADDRESS" .env; then
        sed -i.bak "s|CONTRACT_ADDRESS=.*|CONTRACT_ADDRESS=$CONTRACT_ADDRESS|" .env
    else
        echo "CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> .env
    fi
fi

print_success "Agent configuration updated"
cd ..

# 4. Build Backend
print_step "Step 4: Building Backend..."
cd backend
if npm run build; then
    print_success "Backend built successfully"
else
    print_error "Backend build failed"
    exit 1
fi
cd ..

# 5. Build Agent
print_step "Step 5: Building Agent..."
cd agent
if npm run build; then
    print_success "Agent built successfully"
else
    print_error "Agent build failed"
    exit 1
fi
cd ..

# 6. Build Frontend
print_step "Step 6: Building Frontend..."
if npm run build; then
    print_success "Frontend built successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

# 7. Verify Deployment
print_step "Step 7: Verifying Deployment..."
if command -v tsx &> /dev/null; then
    if tsx scripts/verify-deployment.ts > /dev/null 2>&1; then
        print_success "Deployment verification passed"
    else
        print_warning "Some deployment checks failed (run 'tsx scripts/verify-deployment.ts' for details)"
    fi
else
    print_warning "tsx not found, skipping deployment verification"
fi

echo ""
echo "===================================================="
print_success "Deployment completed successfully!"
echo ""
echo "Contract Address: $CONTRACT_ADDRESS"
echo "PolygonScan: https://polygonscan.com/address/$CONTRACT_ADDRESS"
echo ""
echo "📋 Next steps:"
echo "1. Verify deployment: tsx scripts/verify-deployment.ts"
echo "2. Test contract: tsx scripts/test-contract.ts"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Test backend: tsx scripts/test-backend.ts"
echo "5. Start frontend: npm run dev"
echo "6. Test agent: cd agent && npm run agent report <address>"
echo ""
echo "📖 For detailed testing guide, see TESTING.md"

