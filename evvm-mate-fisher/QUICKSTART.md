# 🚀 Quick Start Guide

## Instalación Rápida (5 minutos)

### 1. Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd frontend
npm install
```

### 2. Configurar Variables de Entorno

**Backend:**
```bash
cd backend
cp .env.example .env
# Edita .env y agrega tu RELAYER_PRIVATE_KEY y SEPOLIA_RPC_URL
```

**Frontend:**
```bash
cd frontend
cp .env.example .env.local
# Opcional: cambia NEXT_PUBLIC_API_URL si el backend está en otro puerto
```

### 3. Obtener Sepolia ETH

1. Ve a: https://sepoliafaucet.com/
2. Ingresa la dirección de tu wallet (la que corresponde a RELAYER_PRIVATE_KEY)
3. Solicita Sepolia ETH

### 4. Iniciar Servicios

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Probar

1. Abre: http://localhost:3000
2. Ingresa un `lotId` (ej: "LOT-001")
3. Selecciona un `eventType`
4. Haz clic en "Registrar Evento"
5. Espera la confirmación y verás el transaction hash

## ✅ Checklist de Configuración

- [ ] Dependencias instaladas (`npm install` en backend y frontend)
- [ ] `.env` configurado en backend con `RELAYER_PRIVATE_KEY` y `SEPOLIA_RPC_URL`
- [ ] Wallet tiene Sepolia ETH (verificar en https://sepolia.etherscan.io)
- [ ] Backend corriendo en `http://localhost:3001`
- [ ] Frontend corriendo en `http://localhost:3000`

## 🐛 Problemas Comunes

**Error: "RELAYER_PRIVATE_KEY no configurada"**
- Verifica que el archivo `.env` existe en `backend/`
- Verifica que la variable está escrita correctamente

**Error: "Wallet sin fondos"**
- Necesitas Sepolia ETH: https://sepoliafaucet.com/
- Verifica el balance en Etherscan

**Frontend no se conecta al backend**
- Verifica que el backend está corriendo
- Verifica `NEXT_PUBLIC_API_URL` en `.env.local`

## 📚 Documentación Completa

Ver [README.md](./README.md) para documentación completa.

