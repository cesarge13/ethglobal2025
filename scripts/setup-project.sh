#!/bin/bash

# Script completo de setup del proyecto
# Uso: ./scripts/setup-project.sh

set -e

echo "🚀 Setting up Agentic Agricultural Validation System"
echo "===================================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Verificar Node.js
print_step "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) detected"

# Verificar npm
print_step "Checking npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm $(npm -v) detected"

# Instalar dependencias raíz
print_step "Installing root dependencies..."
if npm install; then
    print_success "Root dependencies installed"
else
    print_error "Failed to install root dependencies"
    exit 1
fi

# Instalar dependencias smart-contracts
print_step "Installing smart-contracts dependencies..."
cd smart-contracts
if npm install; then
    print_success "Smart contracts dependencies installed"
else
    print_error "Failed to install smart contracts dependencies"
    exit 1
fi
cd ..

# Instalar dependencias backend
print_step "Installing backend dependencies..."
cd backend
if npm install; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi
cd ..

# Instalar dependencias agent
print_step "Installing agent dependencies..."
cd agent
if npm install; then
    print_success "Agent dependencies installed"
else
    print_error "Failed to install agent dependencies"
    exit 1
fi
cd ..

# Crear archivos .env de ejemplo si no existen
print_step "Setting up environment files..."

# Smart Contracts .env
if [ ! -f "smart-contracts/.env" ]; then
    print_warning "Creating smart-contracts/.env.example..."
    cat > smart-contracts/.env.example << EOF
# Polygon Mainnet Configuration
PRIVATE_KEY=your_private_key_here
POLYGON_RPC_URL=https://polygon-rpc.com
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
EOF
    print_warning "Please create smart-contracts/.env with your configuration"
else
    print_success "smart-contracts/.env exists"
fi

# Backend .env
if [ ! -f "backend/.env" ]; then
    print_warning "Creating backend/.env.example..."
    cat > backend/.env.example << EOF
# Backend Configuration
PORT=3001
NODE_ENV=development
POLYGON_RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=0x1D645cd86Ad6920132f5fa1081C20A677B854F3D

# Optional: Only needed for write operations
PRIVATE_KEY=your_private_key_here

# Optional: OpenAI API Key for LLM features
OPENAI_API_KEY=your_openai_api_key_here
EOF
    print_warning "Please create backend/.env with your configuration"
else
    print_success "backend/.env exists"
fi

# Agent .env
if [ ! -f "agent/.env" ]; then
    print_warning "Creating agent/.env.example..."
    cat > agent/.env.example << EOF
# Agent Configuration
POLYGON_RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=0x1D645cd86Ad6920132f5fa1081C20A677B854F3D
AGENT_PRIVATE_KEY=your_agent_private_key_here

# Optional: OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here
EOF
    print_warning "Please create agent/.env with your configuration"
else
    print_success "agent/.env exists"
fi

# Compilar smart contracts
print_step "Compiling smart contracts..."
cd smart-contracts
if npm run compile; then
    print_success "Smart contracts compiled"
else
    print_error "Failed to compile smart contracts"
    exit 1
fi
cd ..

# Compilar backend
print_step "Building backend..."
cd backend
if npm run build; then
    print_success "Backend built"
else
    print_error "Failed to build backend"
    exit 1
fi
cd ..

# Compilar agent
print_step "Building agent..."
cd agent
if npm run build; then
    print_success "Agent built"
else
    print_error "Failed to build agent"
    exit 1
fi
cd ..

echo ""
echo "===================================================="
print_success "Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Configure environment files:"
echo "   - smart-contracts/.env"
echo "   - backend/.env"
echo "   - agent/.env"
echo ""
echo "2. Deploy smart contract (if not already deployed):"
echo "   ./scripts/deploy-all.sh"
echo ""
echo "3. Start backend:"
echo "   cd backend && npm run dev"
echo ""
echo "4. Start frontend:"
echo "   npm run dev"
echo ""
echo "5. Test the system:"
echo "   ./scripts/test-all.sh"
echo ""

