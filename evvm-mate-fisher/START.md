# 🚀 Inicio Rápido

## 1. Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd frontend
npm install
```

## 2. Configurar Backend

```bash
cd backend
cp .env.example .env
# Edita .env y agrega tu RELAYER_PRIVATE_KEY y POLYGON_RPC_URL
```

## 3. Ejecutar

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 4. Probar

Abre: http://localhost:3000

## ⚠️ Importante

- Necesitas MATIC en Polygon Mainnet para pagar gas
- Verifica que tu RELAYER_PRIVATE_KEY tenga fondos
