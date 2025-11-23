# 🚀 Guía de Despliegue - Polygon Mainnet

## 📋 Requisitos Previos

✅ **Tienes:** 50 MATIC (POL) en tu wallet - **SUFICIENTE** para el despliegue
✅ **Necesitas:**
- Private Key de tu wallet (sin 0x)
- RPC URL de Polygon Mainnet
- (Opcional) API Key de PolygonScan para verificar el contrato

## 🔧 Paso 1: Configurar Variables de Entorno

### 1.1 Obtener tu Private Key

**⚠️ IMPORTANTE:** Nunca compartas tu private key. Solo úsala localmente.

Si usas MetaMask u otra wallet:
1. Exporta tu private key desde tu wallet
2. **NO incluyas el prefijo `0x`** al copiarlo al .env

### 1.2 Obtener RPC URL de Polygon

**Opción A: RPC Público (gratis, puede ser lento)**
```
https://polygon-rpc.com
```

**Opción B: Alchemy (recomendado, gratis con límites)**
1. Ve a https://www.alchemy.com/
2. Crea cuenta gratuita
3. Crea nueva app → Polygon Mainnet
4. Copia el HTTP URL (ej: `https://polygon-mainnet.g.alchemy.com/v2/TU_API_KEY`)

**Opción C: Infura (recomendado, gratis con límites)**
1. Ve a https://infura.io/
2. Crea cuenta gratuita
3. Crea nuevo proyecto → Polygon Mainnet
4. Copia el endpoint (ej: `https://polygon-mainnet.infura.io/v3/TU_PROJECT_ID`)

### 1.3 (Opcional) Obtener PolygonScan API Key

1. Ve a https://polygonscan.com/
2. Crea cuenta gratuita
3. Ve a API-KEYs → Add
4. Copia tu API key

## 📝 Paso 2: Crear archivo .env

En la carpeta `smart-contracts/`, crea un archivo `.env` con:

```env
# Tu Private Key (SIN el prefijo 0x)
PRIVATE_KEY=tu_private_key_aqui_sin_0x

# RPC URL de Polygon Mainnet
POLYGON_RPC_URL=https://polygon-rpc.com

# (Opcional) API Key de PolygonScan para verificar el contrato
POLYGONSCAN_API_KEY=tu_api_key_aqui
```

**Ejemplo:**
```env
PRIVATE_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/tu_api_key
POLYGONSCAN_API_KEY=TU_POLYGONSCAN_API_KEY
```

## 🚀 Paso 3: Verificar Preparación

```bash
cd smart-contracts

# Verificar que el contrato esté compilado
npm run compile

# Verificar que tienes MATIC (el script lo verificará automáticamente)
```

## 🎯 Paso 4: Desplegar el Contrato

```bash
# Desde la carpeta smart-contracts/
npm run deploy:polygon
```

O directamente:
```bash
npx hardhat run ../scripts/deploy-contract.ts --network polygon
```

## 📊 Paso 5: Verificar el Despliegue

Después del despliegue, verás:
- ✅ Dirección del contrato desplegado
- ✅ Link a PolygonScan
- ✅ Información guardada en `deployments/polygon-mainnet.json`

## 🔗 Paso 6: Configurar Backend

Después del despliegue, copia la dirección del contrato y actualiza el `.env` del backend:

```bash
cd ../backend
# Editar .env y agregar:
CONTRACT_ADDRESS=0x...direccion_del_contrato...
```

## 💰 Estimación de Costos

- **Gas estimado:** ~2-5 MATIC (depende del precio del gas)
- **Tienes:** 50 MATIC ✅ **MÁS QUE SUFICIENTE**

## ⚠️ Seguridad

- ✅ **NUNCA** compartas tu `.env` o private key
- ✅ **NUNCA** hagas commit del `.env` a git
- ✅ El `.env` está en `.gitignore` por seguridad
- ✅ Usa un RPC privado (Alchemy/Infura) en producción

## 🐛 Troubleshooting

### Error: "PRIVATE_KEY no configurada"
- Verifica que el archivo `.env` existe en `smart-contracts/`
- Verifica que `PRIVATE_KEY` está sin el prefijo `0x`

### Error: "La cuenta no tiene MATIC"
- Verifica que tu wallet tiene MATIC
- Verifica que la PRIVATE_KEY corresponde a la wallet con MATIC

### Error: "Network error"
- Verifica que `POLYGON_RPC_URL` es correcta
- Prueba con otro RPC (Alchemy o Infura)

### Error de compilación
```bash
npm run compile
```

## 📞 Siguiente Paso

Después del despliegue exitoso:
1. ✅ Guarda la dirección del contrato
2. ✅ Configura el backend con `CONTRACT_ADDRESS`
3. ✅ Continúa con la Parte 2 (integración completa)

