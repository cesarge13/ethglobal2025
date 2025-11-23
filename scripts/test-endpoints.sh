#!/bin/bash

# Script de prueba para endpoints del backend
# Uso: ./scripts/test-endpoints.sh

BASE_URL="http://localhost:3001"

echo "🧪 Probando endpoints del backend..."
echo ""

# 1. Health Check
echo "1️⃣ Health Check:"
curl -s "$BASE_URL/health" | jq '.' || echo "❌ Error"
echo ""

# 2. Upload Docs (simulado)
echo "2️⃣ Upload Docs (simulado):"
curl -s -X POST "$BASE_URL/api/upload-docs" \
  -H "Content-Type: application/json" \
  -d '{"farmerAddress":"0x1234567890123456789012345678901234567890","docType":"identity"}' | jq '.' || echo "❌ Error (esperado sin archivos)"
echo ""

# 3. Request Verification
echo "3️⃣ Request Verification:"
curl -s -X POST "$BASE_URL/api/request-verification" \
  -H "Content-Type: application/json" \
  -d '{
    "farmerAddress": "0x1234567890123456789012345678901234567890",
    "documentHashes": ["hash1", "hash2"]
  }' | jq '.' || echo "❌ Error"
echo ""

# 4. Execute x402 Payment
echo "4️⃣ Execute x402 Payment:"
curl -s -X POST "$BASE_URL/api/execute-x402-payment" \
  -H "Content-Type: application/json" \
  -d '{
    "farmerAddress": "0x1234567890123456789012345678901234567890",
    "amount": "0.001",
    "action": "document_validation"
  }' | jq '.' || echo "❌ Error"
echo ""

# 5. Update Reputation
echo "5️⃣ Update Reputation:"
curl -s -X POST "$BASE_URL/api/update-reputation" \
  -H "Content-Type: application/json" \
  -d '{
    "farmerAddress": "0x1234567890123456789012345678901234567890",
    "newScore": 85
  }' | jq '.' || echo "❌ Error"
echo ""

# 6. Generate Report
echo "6️⃣ Generate Report:"
curl -s -X POST "$BASE_URL/api/generate-report" \
  -H "Content-Type: application/json" \
  -d '{
    "farmerAddress": "0x1234567890123456789012345678901234567890"
  }' | jq '.' || echo "❌ Error"
echo ""

# 7. Get User Status
echo "7️⃣ Get User Status:"
curl -s "$BASE_URL/api/get-user-status/0x1234567890123456789012345678901234567890" | jq '.' || echo "❌ Error"
echo ""

echo "✅ Pruebas completadas!"

