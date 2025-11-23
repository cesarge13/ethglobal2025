# 🤖 Agente IA de Validación Agrícola

Agente inteligente para procesamiento de documentos agrícolas con ejecución automática de micropagos x402 en Polygon Mainnet.

## 🎯 Características

- ✅ Procesamiento de documentos (PDF, imágenes)
- ✅ Análisis inteligente con LLM (OpenAI GPT)
- ✅ Validación de 4 pasos: Identidad, Certificaciones, Almacén, Cultivo
- ✅ Ejecución automática de micropagos x402
- ✅ Actualización de reputación on-chain
- ✅ Generación de informes de confianza agrícola

## 📦 Instalación

```bash
cd agent
npm install
```

## ⚙️ Configuración

Crea un archivo `.env` en el directorio `agent/`:

```env
# Blockchain
POLYGON_RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=0x1D645cd86Ad6920132f5fa1081C20A677B854F3D

# Wallet del agente (para ejecutar transacciones)
AGENT_PRIVATE_KEY=tu_private_key_aqui
# O usar PRIVATE_KEY del sistema
PRIVATE_KEY=tu_private_key_aqui

# OpenAI (opcional, para análisis avanzado)
OPENAI_API_KEY=tu_openai_api_key_aqui
```

## 🚀 Uso

### Como Módulo

```typescript
import { AgriculturalValidationAgent } from './agent';

const agent = new AgriculturalValidationAgent();

// Procesar documentos
const result = await agent.processDocuments(
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  ['identity.pdf', 'certification.pdf']
);

// Validación completa (4 pasos)
const validation = await agent.executeFullValidation(
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  {
    identity: 'identity.pdf',
    certifications: ['cert1.pdf', 'cert2.pdf'],
    warehouse: 'warehouse.pdf',
    crop: 'crop.pdf'
  }
);

// Generar informe
const report = await agent.generateReport('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
```

### Como CLI

```bash
# Validar documentos
npm run agent validate 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb identity.pdf cert.pdf

# Generar informe
npm run agent report 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

## 📋 Flujo de Validación

### Paso 1: Validación de Identidad
- Procesa documentos de identidad (INE, CURP, RFC)
- Analiza con LLM para verificar autenticidad
- Ejecuta micropago x402 (0.0005 MATIC)
- Registra verificación en blockchain

### Paso 2: Validación de Certificaciones
- Procesa certificaciones (SAGARPA, SENASICA, orgánicas, BPA)
- Valida números de certificación y fechas
- Ejecuta micropago x402 (0.002 MATIC)
- Registra certificaciones válidas

### Paso 3: Validación de Almacén
- Procesa documentos de almacenes/bodegas
- Verifica ubicación y certificaciones
- Ejecuta micropago x402 (0.0005 MATIC)
- Registra verificación

### Paso 4: Validación de Cultivo
- Procesa documentos de cultivos/cosechas
- Valida tipo de cultivo y fechas
- Ejecuta micropago x402 (0.0005 MATIC)
- Registra verificación final

## 💰 Tarifas de Micropagos

| Acción | Tarifa |
|--------|--------|
| Validación de Documento | 0.001 MATIC |
| Verificación de Certificación | 0.002 MATIC |
| Paso de Verificación | 0.0005 MATIC |
| Generación de Informe | 0.003 MATIC |

## 🔧 Servicios

### DocumentProcessor
Procesa documentos PDF e imágenes, extrae contenido y genera hash.

### LLMService
Analiza documentos usando OpenAI GPT para validación inteligente.

### BlockchainService
Interactúa con el Smart Contract y ejecuta micropagos x402.

## 📊 Ejemplo de Resultado

```json
{
  "success": true,
  "steps": [
    {
      "step": 1,
      "name": "Validación de Identidad",
      "status": true,
      "confidence": 95,
      "txHash": "0x...",
      "paymentHash": "0x..."
    },
    {
      "step": 2,
      "name": "Validación de Certificaciones",
      "status": true,
      "confidence": 88,
      "txHash": "0x...",
      "paymentHash": "0x..."
    }
  ],
  "finalReputation": 85,
  "totalPayments": 4,
  "totalAmount": "0.004000"
}
```

## 🔗 Integración con Backend

El agente puede integrarse con el backend mediante API:

```typescript
// En el backend, llamar al agente cuando se suben documentos
import { AgriculturalValidationAgent } from '../agent/src/agent';

const agent = new AgriculturalValidationAgent();
const result = await agent.processDocuments(farmerAddress, documentPaths);
```

## 📝 Notas

- El agente requiere MATIC en el wallet para ejecutar micropagos
- Sin OPENAI_API_KEY, el análisis será básico (modo fallback)
- Los documentos deben estar en formato PDF o imagen (JPEG, PNG)
- El agente registra todas las acciones en blockchain

## 🐛 Troubleshooting

### Error: "Wallet no configurado"
- Configura `AGENT_PRIVATE_KEY` o `PRIVATE_KEY` en `.env`

### Error: "Contrato no configurado"
- Verifica que `CONTRACT_ADDRESS` esté configurado correctamente

### Error: "Balance insuficiente"
- Asegúrate de tener MATIC en el wallet del agente

### Análisis básico sin LLM
- Si no tienes `OPENAI_API_KEY`, el agente usará análisis básico
- Para análisis avanzado, configura `OPENAI_API_KEY`

## 📚 Documentación Adicional

- [Smart Contract](../smart-contracts/contracts/AgriculturalReputation.sol)
- [Backend API](../backend/README.md)
- [Integración x402](../INTEGRACION_X402_LLM_AUTOPAY.md)
