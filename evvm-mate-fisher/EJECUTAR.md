# 🚀 CÓMO EJECUTAR

## Paso 1: Instalar Backend

```bash
cd backend
npm install
```

## Paso 2: Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita `backend/.env` y agrega:
```env
RELAYER_PRIVATE_KEY=tu_clave_privada_sin_0x
POLYGON_RPC_URL=https://polygon-rpc.com
```

## Paso 3: Instalar Frontend

```bash
cd ../frontend
npm install
```

## Paso 4: Ejecutar Backend

En una terminal:
```bash
cd backend
npm run dev
```

Deberías ver:
```
🚀 EVVM MATE Fisher Backend corriendo en http://localhost:3001
🌐 Red: Polygon Mainnet
```

## Paso 5: Ejecutar Frontend

En otra terminal:
```bash
cd frontend
npm run dev
```

Deberías ver:
```
- ready started server on 0.0.0.0:3000
```

## Paso 6: Probar

1. Abre: http://localhost:3000
2. Ingresa un `lotId` (ej: "LOT-001")
3. Selecciona un `eventType`
4. Haz clic en "Registrar Evento"
5. Espera la confirmación
6. Verás el transaction hash con link a PolygonScan

## ⚠️ IMPORTANTE

- Necesitas MATIC en Polygon Mainnet (no Sepolia ETH)
- Tu wallet debe tener fondos para pagar gas
- Verifica el balance en: https://polygonscan.com
