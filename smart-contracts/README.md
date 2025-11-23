# Smart Contracts - Sistema de Reputación Agrícola

Smart Contracts desplegados en **Polygon Mainnet** para gestionar la reputación agrícola on-chain.

## 📋 Contrato: AgriculturalReputation.sol

### Funcionalidades

- ✅ Registro de agricultores
- ✅ Gestión de documentos (hash on-chain)
- ✅ Sistema de reputación (0-100)
- ✅ Verificaciones por pasos (identidad, certificación, almacén, cultivo)
- ✅ Certificaciones mexicanas (SAGARPA, SENASICA, BPA, orgánicos)
- ✅ Eventos para integración con x402 y frontend
- ✅ Optimizado para gas en Polygon Mainnet

### Eventos Emitidos

- `FarmerRegistered`: Cuando se registra un nuevo agricultor
- `ReputationUpdated`: Cuando cambia el score de reputación
- `DocumentRegistered`: Cuando se registra un documento
- `VerificationLogged`: Cuando el agente IA completa una verificación
- `CertificationAdded`: Cuando se agrega una certificación válida
- `X402PaymentExecuted`: Cuando se ejecuta un micropago x402

## 🚀 Despliegue en Polygon Mainnet

### Prerrequisitos

1. Node.js 18+
2. MATIC en tu wallet para gas
3. Private key con fondos

### Configuración

1. Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita `.env` con tus credenciales:
```env
POLYGON_RPC_URL=https://polygon-rpc.com
PRIVATE_KEY=tu_private_key_sin_0x
```

### Instalación

```bash
cd smart-contracts
npm install
```

### Compilar

```bash
npm run compile
```

### Desplegar

**⚠️ IMPORTANTE: Esto despliega en MAINNET. Asegúrate de tener MATIC suficiente.**

```bash
npm run deploy:polygon
```

O directamente:
```bash
npx hardhat run ../scripts/deploy-contract.ts --network polygon
```

### Verificar en PolygonScan

Después del despliegue, verifica el contrato:

```bash
npx hardhat verify --network polygon <CONTRACT_ADDRESS>
```

## 📊 Estructura del Contrato

### Farmer (Agricultor)
- `farmerAddress`: Dirección del agricultor
- `farmerId`: ID único
- `reputationScore`: Score 0-100
- `totalVerifications`: Total de verificaciones
- `validCertifications`: Certificaciones válidas
- `isRegistered`: Estado de registro
- `registrationDate`: Fecha de registro

### Document
- `docHash`: Hash del documento
- `docType`: Tipo (identity, certification, warehouse, crop)
- `timestamp`: Timestamp
- `isValidated`: Estado de validación
- `validatedBy`: Agente que validó

### Verification
- `step`: Paso (1-4)
- `status`: Estado (true/false)
- `timestamp`: Timestamp
- `verifiedBy`: Agente que verificó
- `details`: Detalles

## 🔗 Integración con Backend

El backend TypeScript se conectará a este contrato usando ethers.js. Ver `../backend/` para más detalles.

## 📝 Notas Importantes

- **Chain ID**: 137 (Polygon Mainnet)
- **Gas Price**: Configurado a 50 gwei por defecto
- **Optimización**: Habilitada con 200 runs
- **Solo Owner**: Solo el owner (agente IA) puede ejecutar funciones de escritura

## 🔐 Seguridad

- El contrato usa `onlyOwner` modifier para funciones críticas
- Validaciones de entrada en todas las funciones
- Límites en scores (0-100)
- Verificación de registro antes de operaciones

