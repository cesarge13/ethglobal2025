#!/bin/bash

# Script completo para probar todos los componentes del sistema

set -e

echo "🧪 Testing Agentic Agricultural Validation System"
echo "=================================================="
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

print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Please run this script from the project root${NC}"
    exit 1
fi

# 1. Test Smart Contract Compilation
print_step "Step 1: Testing Smart Contract Compilation..."
cd smart-contracts
if npm run compile > /dev/null 2>&1; then
    print_result 0 "Smart contract compiles successfully"
else
    print_result 1 "Smart contract compilation failed"
    exit 1
fi
cd ..

# 2. Test Backend Compilation
print_step "Step 2: Testing Backend Compilation..."
cd backend
if npm run build > /dev/null 2>&1; then
    print_result 0 "Backend compiles successfully"
else
    print_result 1 "Backend compilation failed"
    exit 1
fi
cd ..

# 3. Test Agent Compilation
print_step "Step 3: Testing Agent Compilation..."
cd agent
if npm run build > /dev/null 2>&1; then
    print_result 0 "Agent compiles successfully"
else
    print_result 1 "Agent compilation failed"
    exit 1
fi
cd ..

# 4. Test Frontend Build
print_step "Step 4: Testing Frontend Build..."
if npm run build > /dev/null 2>&1; then
    print_result 0 "Frontend builds successfully"
else
    print_result 1 "Frontend build failed"
    exit 1
fi

# 5. Test Contract Deployment (if .env exists)
print_step "Step 5: Testing Contract Deployment..."
if [ -f "smart-contracts/.env" ] && [ -f ".env" ]; then
    if command -v tsx &> /dev/null; then
        if tsx scripts/test-contract.ts > /dev/null 2>&1; then
            print_result 0 "Contract deployment verified"
        else
            print_warning "Contract deployment check failed (contract may not be deployed)"
        fi
    else
        print_warning "tsx not found, skipping contract test"
    fi
else
    print_warning ".env files not found, skipping contract test"
fi

# 6. Test Backend Health (if running)
print_step "Step 6: Testing Backend Health..."
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    print_result 0 "Backend is running and healthy"
    
    # Test backend endpoints if running
    if command -v tsx &> /dev/null; then
        print_step "Step 7: Testing Backend Endpoints..."
        if tsx scripts/test-backend.ts > /dev/null 2>&1; then
            print_result 0 "Backend endpoints working"
        else
            print_warning "Some backend endpoints may have issues"
        fi
    fi
else
    print_warning "Backend not running (start with: cd backend && npm run dev)"
fi

# 7. Verify Deployment
print_step "Step 8: Verifying Deployment..."
if command -v tsx &> /dev/null; then
    if tsx scripts/verify-deployment.ts > /dev/null 2>&1; then
        print_result 0 "Deployment verification passed"
    else
        print_warning "Some deployment checks failed"
    fi
else
    print_warning "tsx not found, skipping deployment verification"
fi

echo ""
echo "=================================================="
echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Start backend: cd backend && npm run dev"
echo "2. Start frontend: npm run dev"
echo "3. Test agent: cd agent && npm run agent report <address>"
echo "4. Run full endpoint tests: ./scripts/test-endpoints.sh"

