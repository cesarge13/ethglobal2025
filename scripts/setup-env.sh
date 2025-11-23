#!/bin/bash

# Script para configurar variables de entorno

set -e

echo "⚙️  Setting up environment variables"
echo "====================================="
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Leer valores
read -p "Enter Polygon RPC URL [https://polygon-rpc.com]: " POLYGON_RPC_URL
POLYGON_RPC_URL=${POLYGON_RPC_URL:-https://polygon-rpc.com}

read -p "Enter Contract Address (or leave empty if not deployed yet): " CONTRACT_ADDRESS

read -sp "Enter Private Key (for transactions): " PRIVATE_KEY
echo ""

read -sp "Enter PolygonScan API Key (optional, for verification): " POLYGONSCAN_API_KEY
echo ""

read -sp "Enter OpenAI API Key (optional, for advanced LLM analysis): " OPENAI_API_KEY
echo ""

# 1. Smart Contracts .env
print_step "Creating smart-contracts/.env..."
cat > smart-contracts/.env << EOF
PRIVATE_KEY=$PRIVATE_KEY
POLYGON_RPC_URL=$POLYGON_RPC_URL
POLYGONSCAN_API_KEY=$POLYGONSCAN_API_KEY
EOF
print_success "smart-contracts/.env created"

# 2. Backend .env
print_step "Creating backend/.env..."
cat > backend/.env << EOF
PORT=3001
NODE_ENV=development
POLYGON_RPC_URL=$POLYGON_RPC_URL
CONTRACT_ADDRESS=$CONTRACT_ADDRESS
PRIVATE_KEY=$PRIVATE_KEY
EOF
print_success "backend/.env created"

# 3. Agent .env
print_step "Creating agent/.env..."
cat > agent/.env << EOF
POLYGON_RPC_URL=$POLYGON_RPC_URL
CONTRACT_ADDRESS=$CONTRACT_ADDRESS
AGENT_PRIVATE_KEY=$PRIVATE_KEY
OPENAI_API_KEY=$OPENAI_API_KEY
EOF
print_success "agent/.env created"

# 4. Frontend .env
print_step "Creating .env for frontend..."
cat > .env << EOF
VITE_API_URL=http://localhost:3001
EOF
print_success ".env created for frontend"

echo ""
echo "====================================="
print_success "Environment setup completed!"
echo ""
echo "⚠️  Important:"
echo "- Never commit .env files to git"
echo "- Keep your private keys secure"
echo "- Update CONTRACT_ADDRESS after deploying the contract"

