# ✅ Integración x402 SDK, LLM Wallet MCP y AutoPay Extension

## 🎉 Resumen

Se ha completado la integración de los tres componentes principales para micropagos y gestión de wallets de agentes IA:

1. **x402 Service** - Micropagos en Polygon Mainnet
2. **LLM Wallet MCP** - Gestión de wallets para agentes IA
3. **AutoPay Extension** - Pagos automáticos basados en eventos

---

## 📦 Componentes Implementados

### 1. **x402 Service** (`backend/src/services/x402.ts`)

Servicio completo para ejecutar micropagos x402 en Polygon Mainnet.

#### Características:
- ✅ Tarifas predefinidas por acción
- ✅ Ejecución de micropagos individuales
- ✅ Ejecución de micropagos en batch (optimización de gas)
- ✅ Registro automático en Smart Contract
- ✅ Verificación de balance antes de ejecutar

#### Tarifas por Acción:
- `document_validation`: 0.001 MATIC
- `certification_check`: 0.002 MATIC
- `verification_step`: 0.0005 MATIC
- `report_generation`: 0.003 MATIC
- `default`: 0.001 MATIC

#### Funciones Principales:
```typescript
- executePayment(farmerAddress, action, customAmount?)
- executeBatchPayments(payments[])
- getBalance()
- getWalletAddress()
- isConfigured()
```

---

### 2. **LLM Wallet MCP** (`backend/src/services/llm-wallet.ts`)

Servicio para gestión de wallets de agentes IA usando Model Context Protocol.

#### Características:
- ✅ Gestión de múltiples wallets por agente
- ✅ Firma y verificación de mensajes
- ✅ Envío de transacciones desde wallets de agentes
- ✅ Obtención de contexto del wallet (MCP)
- ✅ Creación dinámica de wallets

#### Agentes Predefinidos:
- `system` - Wallet principal del sistema
- `document_validator` - Wallet para validación de documentos
- `certification_checker` - Wallet para verificación de certificaciones
- `report_generator` - Wallet para generación de reportes

#### Funciones Principales:
```typescript
- getWallet(agentId)
- createWallet(agentId)
- getBalance(agentId)
- getAddress(agentId)
- signMessage(agentId, message)
- verifyMessage(message, signature)
- sendTransaction(agentId, to, value, data?)
- getWalletContext(agentId)
- listWallets()
```

---

### 3. **AutoPay Extension** (`backend/src/services/autopay.ts`)

Servicio para pagos automáticos basados en eventos del sistema.

#### Características:
- ✅ Reglas de AutoPay configurables
- ✅ Múltiples triggers de eventos
- ✅ Condiciones personalizables
- ✅ Ejecución automática de micropagos
- ✅ Estadísticas y seguimiento

#### Triggers Disponibles:
- `document_validated` - Cuando se valida un documento
- `verification_completed` - Cuando se completa una verificación
- `certification_added` - Cuando se agrega una certificación
- `reputation_threshold` - Cuando se alcanza un umbral de reputación

#### Funciones Principales:
```typescript
- createRule(rule)
- updateRule(ruleId, updates)
- deleteRule(ruleId)
- getRulesForFarmer(farmerAddress)
- getActiveRules()
- processEvent(eventType, data)
- getStats()
```

---

## 🔌 Endpoints API

### x402 Micropayments

#### `POST /api/execute-x402-payment`
Ejecuta un micropago x402.

**Body:**
```json
{
  "farmerAddress": "0x...",
  "action": "document_validation",
  "amount": "0.001" // Opcional
}
```

#### `POST /api/execute-x402-payment/batch`
Ejecuta múltiples micropagos en batch.

**Body:**
```json
{
  "payments": [
    { "farmerAddress": "0x...", "action": "document_validation" },
    { "farmerAddress": "0x...", "action": "certification_check" }
  ]
}
```

#### `GET /api/x402-balance`
Obtiene el balance del wallet de micropagos.

#### `GET /api/x402-rates`
Obtiene las tarifas de micropagos por acción.

---

### LLM Wallet MCP

#### `GET /api/llm-wallet/:agentId/context`
Obtiene el contexto del wallet de un agente (MCP).

#### `GET /api/llm-wallet/:agentId/balance`
Obtiene el balance del wallet de un agente.

#### `POST /api/llm-wallet/:agentId/sign`
Firma un mensaje con el wallet del agente.

**Body:**
```json
{
  "message": "Mensaje a firmar"
}
```

#### `POST /api/llm-wallet/verify`
Verifica una firma de mensaje.

**Body:**
```json
{
  "message": "Mensaje original",
  "signature": "0x..."
}
```

#### `POST /api/llm-wallet/:agentId/send-transaction`
Envía una transacción desde el wallet del agente.

**Body:**
```json
{
  "to": "0x...",
  "value": "0.001",
  "data": "0x..." // Opcional
}
```

#### `POST /api/llm-wallet/:agentId/create`
Crea un nuevo wallet para un agente.

#### `GET /api/llm-wallet/list`
Lista todos los wallets disponibles.

---

### AutoPay Extension

#### `POST /api/autopay/rules`
Crea una nueva regla de AutoPay.

**Body:**
```json
{
  "farmerAddress": "0x...",
  "trigger": "document_validated",
  "condition": {
    "minReputation": 50
  },
  "action": "document_validation",
  "amount": "0.001", // Opcional
  "enabled": true
}
```

#### `GET /api/autopay/rules`
Obtiene todas las reglas de AutoPay (opcional: `?farmerAddress=0x...`).

#### `PUT /api/autopay/rules/:ruleId`
Actualiza una regla de AutoPay.

#### `DELETE /api/autopay/rules/:ruleId`
Elimina una regla de AutoPay.

#### `POST /api/autopay/process-event`
Procesa un evento manualmente (útil para testing).

**Body:**
```json
{
  "eventType": "document_validated",
  "data": {
    "farmerAddress": "0x...",
    "verificationStep": 1
  }
}
```

#### `GET /api/autopay/stats`
Obtiene estadísticas de AutoPay.

---

## ⚙️ Configuración

### Variables de Entorno Requeridas

```env
# Backend
PORT=3001
POLYGON_RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=0x1D645cd86Ad6920132f5fa1081C20A677B854F3D

# Para transacciones (x402 y LLM Wallet)
PRIVATE_KEY=tu_private_key_del_owner

# Opcional: Wallets específicos para agentes
AGENT_VALIDATOR_KEY=...
AGENT_CERTIFIER_KEY=...
AGENT_REPORTER_KEY=...
```

---

## 🔄 Integración con Smart Contract

El servicio x402 se integra automáticamente con el Smart Contract `AgriculturalReputation`:

- ✅ Registra pagos ejecutados usando `logX402Payment()`
- ✅ Emite eventos `X402PaymentExecuted` en blockchain
- ✅ Mantiene trazabilidad completa de micropagos

---

## 📊 Flujo de Trabajo

### Ejemplo: Validación de Documento con Micropago

1. **Agente IA procesa documento**
   ```typescript
   // El agente usa LLM Wallet para firmar la validación
   const signature = await llmWalletService.signMessage('document_validator', documentHash);
   ```

2. **Registrar documento en contrato**
   ```typescript
   await contractService.registerDocument(farmerAddress, docHash, 'identity');
   ```

3. **Ejecutar micropago x402**
   ```typescript
   const payment = await x402Service.executePayment(
     farmerAddress,
     'document_validation'
   );
   ```

4. **AutoPay procesa evento (si hay reglas)**
   ```typescript
   await autoPayService.processEvent('document_validated', {
     farmerAddress,
     verificationStep: 1
   });
   ```

---

## 🧪 Pruebas

### Probar x402 Service

```bash
# Obtener balance
curl http://localhost:3001/api/x402-balance

# Obtener tarifas
curl http://localhost:3001/api/x402-rates

# Ejecutar micropago
curl -X POST http://localhost:3001/api/execute-x402-payment \
  -H "Content-Type: application/json" \
  -d '{
    "farmerAddress": "0x...",
    "action": "document_validation"
  }'
```

### Probar LLM Wallet

```bash
# Obtener contexto del wallet
curl http://localhost:3001/api/llm-wallet/system/context

# Firmar mensaje
curl -X POST http://localhost:3001/api/llm-wallet/system/sign \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message"}'
```

### Probar AutoPay

```bash
# Crear regla
curl -X POST http://localhost:3001/api/autopay/rules \
  -H "Content-Type: application/json" \
  -d '{
    "farmerAddress": "0x...",
    "trigger": "document_validated",
    "action": "document_validation",
    "enabled": true
  }'

# Obtener estadísticas
curl http://localhost:3001/api/autopay/stats
```

---

## ✅ Estado de Implementación

- ✅ x402 Service - COMPLETADO
- ✅ LLM Wallet MCP - COMPLETADO
- ✅ AutoPay Extension - COMPLETADO
- ✅ Integración con Smart Contract - COMPLETADO
- ✅ Endpoints API - COMPLETADO
- ✅ Compilación TypeScript - COMPLETADO

---

## 📝 Notas Importantes

1. **Seguridad:**
   - ⚠️ Nunca expongas `PRIVATE_KEY` en producción
   - ⚠️ Usa variables de entorno para todas las claves
   - ⚠️ Considera usar un multisig para el wallet principal

2. **Gas Optimization:**
   - Los micropagos en batch optimizan el uso de gas
   - Las tarifas están optimizadas para Polygon Mainnet

3. **Escalabilidad:**
   - AutoPay puede procesar múltiples eventos simultáneamente
   - Los wallets de agentes permiten paralelización

---

## 🚀 Próximos Pasos

1. ⏳ Integrar con Agente IA para procesamiento automático
2. ⏳ Implementar base de datos para persistencia de reglas AutoPay
3. ⏳ Agregar monitoreo y alertas
4. ⏳ Implementar rate limiting para endpoints públicos
5. ⏳ Agregar tests unitarios y de integración

---

## 📚 Documentación Adicional

- [Backend Conectado](./BACKEND_CONECTADO.md)
- [Pruebas de Endpoints](./PRUEBAS_ENDPOINTS.md)
- [Smart Contract](./smart-contracts/contracts/AgriculturalReputation.sol)

