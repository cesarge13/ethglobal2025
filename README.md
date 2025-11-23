# 🌾 Agentic Agricultural Validation System

> **ETHGlobal Hackathon Project** | Polygon Mainnet | x402 Micropayments | LLM Wallet MCP | AutoPay Extension

Sistema completo de validación agrícola agéntica desplegado en **Polygon Mainnet** donde un agente IA analiza documentación agrícola y ejecuta micropagos x402 por cada acción de validación.

---

## 🚀 Quick Start

### 1. Setup Completo

```bash
# Instalar dependencias y compilar
./scripts/setup-project.sh
```

### 2. Iniciar Servicios

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

### 3. Usar el Dashboard

1. Abre http://localhost:3000
2. Conecta tu wallet (Polygon Mainnet)
3. Ve a "Validación Agrícola"
4. Sube documentos y verifica en blockchain

---

## 📚 Documentación

- **[README_ETHGLOBAL.md](./README_ETHGLOBAL.md)** - Documentación completa del proyecto
- **[TESTING.md](./TESTING.md)** - Guía completa de testing
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía de deployment
- **[GUIA_PRUEBAS_DASHBOARD.md](./GUIA_PRUEBAS_DASHBOARD.md)** - Cómo probar el dashboard

---

## 🛠️ Tech Stack

- **Smart Contracts**: Solidity 0.8.20, Hardhat
- **Backend**: Node.js, TypeScript, Express, ethers.js
- **AI Agent**: TypeScript, OpenAI GPT-4o-mini
- **Frontend**: React, Vite, Wagmi, RainbowKit
- **Blockchain**: Polygon Mainnet

---

## 🔗 Links Importantes

- **Contrato en PolygonScan**: https://polygonscan.com/address/0x1D645cd86Ad6920132f5fa1081C20A677B854F3D
- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:3000

---

## ✅ Estado del Proyecto

- ✅ Smart Contract: Desplegado y verificado en Polygon Mainnet
- ✅ Backend: Conectado con Smart Contract, PRIVATE_KEY configurada
- ✅ Frontend: Dashboard completo funcionando
- ✅ Agent: Listo para procesar documentos
- ✅ Scripts: Deploy, testing y verificación completos

---

**🎉 Proyecto completo y listo para ETHGlobal!**
