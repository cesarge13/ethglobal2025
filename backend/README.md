# Backend - Sistema de Validación Agrícola Agéntica

Backend TypeScript con Express para el sistema de validación agrícola con micropagos x402 en Polygon Mainnet.

## 📋 Endpoints

### 1. `POST /api/upload-docs`
Sube documentos agrícolas (PDF, imágenes)

**Body:**
```json
{
  "farmerAddress": "0x...",
  "docType": "identity|certification|warehouse|crop",
  "files": [archivos]
}
```

### 2. `POST /api/request-verification`
Solicita verificación por el agente IA

**Body:**
```json
{
  "farmerAddress": "0x...",
  "documentHashes": ["hash1", "hash2"]
}
```

### 3. `POST /api/execute-x402-payment`
Ejecuta micropago x402 en Polygon Mainnet

**Body:**
```json
{
  "farmerAddress": "0x...",
  "amount": "0.001",
  "action": "document_validation"
}
```

### 4. `POST /api/update-reputation`
Actualiza score de reputación en smart contract

**Body:**
```json
{
  "farmerAddress": "0x...",
  "newScore": 85
}
```

### 5. `POST /api/generate-report`
Genera informe de confianza agrícola IA

**Body:**
```json
{
  "farmerAddress": "0x...",
  "verificationId": "verification_123"
}
```

### 6. `GET /api/get-user-status/:address`
Obtiene estado completo del agricultor

## 🚀 Instalación

```bash
cd backend
npm install
```

## ⚙️ Configuración

1. Copia `.env.example` a `.env`
2. Configura las variables de entorno:
   - `POLYGON_RPC_URL`: RPC de Polygon Mainnet
   - `CONTRACT_ADDRESS`: Dirección del contrato desplegado
   - `X402_API_KEY`: API key de x402 (Parte 3)
   - `LLM_WALLET_PRIVATE_KEY`: Private key del wallet del agente IA (Parte 3)

## 🏃 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## 📝 Notas

- Todos los endpoints están preparados para integración con x402, LLM Wallet y el agente IA
- Los TODOs indican dónde se integrarán las funcionalidades en las siguientes partes
- El backend se conecta directamente a Polygon Mainnet (Chain ID: 137)

