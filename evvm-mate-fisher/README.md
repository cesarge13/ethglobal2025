# 🌾 EVVM MATE Fisher

Proyecto completo para registrar eventos agrícolas en el **MATE EVVM Metaprotocol** usando el executor oficial desplegado en Sepolia.

## 📋 Descripción

Este proyecto implementa un **Fisher** (registrador de eventos) que:

1. Recibe eventos agrícolas (lotId + eventType)
2. Construye un payload compatible con x402/EVVM
3. Envía el payload al MATE EVVM (EVVM ID = 2) usando el executor en Sepolia
4. Devuelve el transaction hash de confirmación

## 🏗️ Estructura del Proyecto

```
evvm-mate-fisher/
├── backend/
│   ├── index.js              # Servidor Express principal
│   ├── services/
│   │   └── executor.js       # Servicio para interactuar con el executor EVVM
│   ├── utils/
│   │   └── payload.js        # Utilidades para construir payloads
│   ├── .env.example          # Template de variables de entorno
│   └── package.json
├── frontend/
│   ├── pages/
│   │   └── index.js          # Página principal
│   ├── components/
│   │   └── EventForm.js      # Componente del formulario
│   ├── .env.example          # Template de variables de entorno
│   └── package.json
└── README.md
```

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ y npm
- Wallet con fondos en Sepolia (para pagar gas)
- Clave privada del relayer
- RPC URL de Sepolia (Infura, Alchemy, etc.)

### 1. Instalar Backend

```bash
cd backend
npm install
```

### 2. Instalar Frontend

```bash
cd frontend
npm install
```

## ⚙️ Configuración

### Backend

1. Copia el archivo de ejemplo:
```bash
cd backend
cp .env.example .env
```

2. Edita `.env` y configura:
```env
RELAYER_PRIVATE_KEY=tu_clave_privada_sin_prefijo_0x
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/TU_INFURA_KEY
PORT=3001
```

**⚠️ IMPORTANTE:**
- La `RELAYER_PRIVATE_KEY` debe ser de un wallet con ETH en Sepolia
- NO subas el archivo `.env` a Git
- Puedes obtener Sepolia ETH desde: https://sepoliafaucet.com/

### Frontend

1. Copia el archivo de ejemplo:
```bash
cd frontend
cp .env.example .env.local
```

2. Edita `.env.local` si el backend está en otro puerto:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🏃 Cómo Correr

### Backend

```bash
cd backend
npm start
```

O en modo desarrollo con auto-reload:
```bash
npm run dev
```

El backend estará disponible en: `http://localhost:3001`

### Frontend

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

## 🧪 Cómo Probar

### 1. Probar el Endpoint Directamente

Usando `curl`:

```bash
curl -X POST http://localhost:3001/registerEvent \
  -H "Content-Type: application/json" \
  -d '{
    "lotId": "LOT-001",
    "eventType": "HARVEST"
  }'
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Evento registrado exitosamente en MATE EVVM",
  "data": {
    "lotId": "LOT-001",
    "eventType": "HARVEST",
    "timestamp": 1234567890,
    "txHash": "0x...",
    "evvmId": 2,
    "explorerUrl": "https://sepolia.etherscan.io/tx/0x..."
  }
}
```

### 2. Probar desde el Frontend

1. Abre `http://localhost:3000`
2. Ingresa un `lotId` (ej: "LOT-001")
3. Selecciona un `eventType` (HARVEST, SHIPPED, o STORAGE)
4. Haz clic en "Registrar Evento"
5. Espera la confirmación y verás el transaction hash

### 3. Ver el Evento en Blockchain

1. Copia el `txHash` que recibiste
2. Ve a Sepolia Etherscan: `https://sepolia.etherscan.io/tx/[TX_HASH]`
3. Verifica que la transacción fue exitosa

## 📡 Endpoints del Backend

### `GET /health`

Health check del servicio.

**Respuesta:**
```json
{
  "status": "ok",
  "service": "EVVM MATE Fisher Backend"
}
```

### `POST /registerEvent`

Registra un evento en MATE EVVM.

**Body:**
```json
{
  "lotId": "string",
  "eventType": "HARVEST" | "SHIPPED" | "STORAGE"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Evento registrado exitosamente en MATE EVVM",
  "data": {
    "lotId": "LOT-001",
    "eventType": "HARVEST",
    "timestamp": 1234567890,
    "txHash": "0x...",
    "evvmId": 2,
    "explorerUrl": "https://sepolia.etherscan.io/tx/0x..."
  }
}
```

**Errores:**

- `400`: Campos faltantes o inválidos
- `500`: Error al ejecutar la transacción

## 🔍 Verificar Eventos en MATE EVVM

### Opción 1: Etherscan

1. Ve a: https://sepolia.etherscan.io
2. Busca el transaction hash
3. Verifica que la transacción fue exitosa
4. Revisa los logs del evento

### Opción 2: Verificar en el Contrato Executor

El executor está desplegado en:
- **Dirección**: `0x9902984d86059234c3B6e11D5eAEC55f9627dD0f`
- **Red**: Sepolia
- **Etherscan**: https://sepolia.etherscan.io/address/0x9902984d86059234c3B6e11D5eAEC55f9627dD0f

## 🛠️ Detalles Técnicos

### Payload Construction

El payload se construye como un JSON string codificado en UTF-8:

```json
{
  "lotId": "LOT-001",
  "eventType": "HARVEST",
  "timestamp": 1234567890
}
```

Este JSON se convierte a bytes usando `ethers.toUtf8Bytes()` y se envía al executor.

### Executor Contract

- **Función**: `executeWithNonce(uint256 evvmId, bytes calldata payload, uint256 nonce)`
- **EVVM ID**: `2` (MATE)
- **Nonce**: Se obtiene automáticamente del wallet

### Flujo de Ejecución

1. Frontend envía `lotId` y `eventType` al backend
2. Backend construye el payload JSON
3. Backend convierte el JSON a bytes
4. Backend obtiene el nonce del wallet
5. Backend llama al executor con `evvmId=2` y el payload
6. Backend espera la confirmación de la transacción
7. Backend devuelve el `txHash` al frontend

## 🐛 Troubleshooting

### Error: "RELAYER_PRIVATE_KEY no configurada"

- Verifica que el archivo `.env` existe en `backend/`
- Verifica que `RELAYER_PRIVATE_KEY` está configurada
- La clave NO debe tener prefijo `0x`

### Error: "Wallet sin fondos"

- Necesitas ETH en Sepolia para pagar gas
- Obtén Sepolia ETH desde: https://sepoliafaucet.com/
- Verifica el balance en: https://sepolia.etherscan.io

### Error: "SEPOLIA_RPC_URL no configurada"

- Verifica que `SEPOLIA_RPC_URL` está en `.env`
- Usa un provider válido (Infura, Alchemy, etc.)
- Verifica que la URL es correcta

### Error: "nonce too low" o "replacement transaction"

- El nonce se obtiene automáticamente
- Si persiste, espera unos segundos y reintenta
- Verifica que no hay otras transacciones pendientes

### Frontend no se conecta al backend

- Verifica que el backend está corriendo en `http://localhost:3001`
- Verifica `NEXT_PUBLIC_API_URL` en `.env.local`
- Verifica CORS en el backend (ya está configurado)

## 📚 Recursos

- **MATE EVVM Metaprotocol**: Documentación oficial del protocolo
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Sepolia Etherscan**: https://sepolia.etherscan.io
- **Ethers.js Docs**: https://docs.ethers.org/

## 📝 Notas

- Este es un proyecto de ejemplo/demo
- En producción, considera usar un relayer más robusto
- Considera agregar rate limiting y autenticación
- Los eventos se registran directamente en blockchain (inmutables)

## 🎯 Próximos Pasos

- [ ] Agregar autenticación al backend
- [ ] Implementar rate limiting
- [ ] Agregar logging más detallado
- [ ] Crear dashboard para ver eventos registrados
- [ ] Agregar tests unitarios e integración

---

**Desarrollado para EVVM MATE Metaprotocol** 🌾

