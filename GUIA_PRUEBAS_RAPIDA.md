# 🚀 Guía Rápida de Pruebas - OrigenMX

## 📄 Tu PDF Subido

### Dónde está:
1. **Archivo físico**: `backend/uploads/` (nombre generado automáticamente)
2. **En Blockchain**: Registrado en Polygon Mainnet con hash SHA256
3. **En la UI**: Ve a **Dashboard del Agricultor** → Tab **"Historial"**

### Cómo verlo:
- Abre el tab **"Historial"** en el Dashboard del Agricultor
- Verás tu documento con:
  - Tipo de documento
  - Hash del documento
  - Estado (Validado/Pendiente)
  - Link a PolygonScan si hay transacción

---

## 🧪 Qué Puedes Probar Ahora

### 1. **Ver tu Documento Subido** ✅
- **Dónde**: Dashboard del Agricultor → Tab "Historial"
- **Qué verás**: Lista de documentos con hash y estado

### 2. **Micropagos x402** 💰

#### Ver Balance del Wallet x402:
```bash
curl http://localhost:3001/api/x402-balance
```
O desde la UI: Próximamente en Settings → Integrations

#### Ver Tarifas x402:
```bash
curl http://localhost:3001/api/x402-rates
```

#### Ejecutar un Micropago x402:
```bash
curl -X POST http://localhost:3001/api/execute-x402-payment \
  -H "Content-Type: application/json" \
  -d '{
    "farmerAddress": "TU_DIRECCION_WALLET",
    "action": "document_validation",
    "amount": "0.001"
  }'
```

**Acciones disponibles:**
- `document_validation` - Validación de documento (0.001 MATIC)
- `certification_check` - Verificación de certificación (0.002 MATIC)
- `verification_step` - Paso de verificación (0.0005 MATIC)
- `report_generation` - Generación de informe (0.003 MATIC)

### 3. **AutoPay Extension** 🤖

#### Ver Reglas de AutoPay:
```bash
curl http://localhost:3001/api/autopay/rules
```

#### Ver Reglas de un Agricultor Específico:
```bash
curl "http://localhost:3001/api/autopay/rules?farmerAddress=TU_DIRECCION"
```

#### Crear una Regla de AutoPay:
```bash
curl -X POST http://localhost:3001/api/autopay/rules \
  -H "Content-Type: application/json" \
  -d '{
    "farmerAddress": "TU_DIRECCION_WALLET",
    "trigger": "document_validated",
    "action": "document_validation",
    "amount": "0.001",
    "enabled": true
  }'
```

**Triggers disponibles:**
- `document_validated` - Cuando se valida un documento
- `verification_completed` - Cuando se completa una verificación
- `certification_added` - Cuando se agrega una certificación
- `reputation_threshold` - Cuando se alcanza un umbral de reputación

#### Procesar un Evento Manualmente (Testing):
```bash
curl -X POST http://localhost:3001/api/autopay/process-event \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "document_validated",
    "data": {
      "farmerAddress": "TU_DIRECCION_WALLET",
      "documentHash": "hash_del_documento"
    }
  }'
```

#### Ver Estadísticas de AutoPay:
```bash
curl http://localhost:3001/api/autopay/stats
```

### 4. **Ver Estado del Agricultor** 👤

```bash
curl http://localhost:3001/api/get-user-status/TU_DIRECCION_WALLET
```

**Respuesta incluye:**
- Estado de registro
- Score de reputación (0-100)
- Total de verificaciones
- Certificaciones válidas
- Lista de documentos
- Historial de verificaciones

### 5. **Actualizar Reputación** 📈

```bash
curl -X POST http://localhost:3001/api/update-reputation \
  -H "Content-Type: application/json" \
  -d '{
    "farmerAddress": "TU_DIRECCION_WALLET",
    "newScore": 75
  }'
```

### 6. **Solicitar Verificación** ✅

```bash
curl -X POST http://localhost:3001/api/request-verification \
  -H "Content-Type: application/json" \
  -d '{
    "farmerAddress": "TU_DIRECCION_WALLET",
    "documentHashes": ["hash1", "hash2"]
  }'
```

### 7. **Generar Informe** 📊

```bash
curl -X POST http://localhost:3001/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "farmerAddress": "TU_DIRECCION_WALLET"
  }'
```

---

## 🎯 Flujo de Prueba Recomendado

1. **Ver tu documento subido**:
   - Dashboard → Validación Agrícola → Tab "Historial"

2. **Ver balance x402**:
   ```bash
   curl http://localhost:3001/api/x402-balance
   ```

3. **Ver tarifas**:
   ```bash
   curl http://localhost:3001/api/x402-rates
   ```

4. **Ejecutar un micropago x402**:
   ```bash
   curl -X POST http://localhost:3001/api/execute-x402-payment \
     -H "Content-Type: application/json" \
     -d '{
       "farmerAddress": "TU_DIRECCION",
       "action": "document_validation"
     }'
   ```

5. **Crear regla de AutoPay**:
   ```bash
   curl -X POST http://localhost:3001/api/autopay/rules \
     -H "Content-Type: application/json" \
     -d '{
       "farmerAddress": "TU_DIRECCION",
       "trigger": "document_validated",
       "action": "document_validation",
       "enabled": true
     }'
   ```

6. **Probar AutoPay manualmente**:
   ```bash
   curl -X POST http://localhost:3001/api/autopay/process-event \
     -H "Content-Type: application/json" \
     -d '{
       "eventType": "document_validated",
       "data": {
         "farmerAddress": "TU_DIRECCION",
         "documentHash": "hash_del_documento"
       }
     }'
   ```

7. **Ver estadísticas**:
   ```bash
   curl http://localhost:3001/api/autopay/stats
   ```

---

## 📍 Endpoints Disponibles

### Documentos
- `POST /api/upload-docs` - Subir documentos ✅ (Ya probado)

### Estado
- `GET /api/get-user-status/:address` - Estado del agricultor

### x402 Micropagos
- `POST /api/execute-x402-payment` - Ejecutar micropago
- `POST /api/execute-x402-payment/batch` - Micropagos en batch
- `GET /api/x402-balance` - Balance del wallet
- `GET /api/x402-rates` - Tarifas

### AutoPay
- `GET /api/autopay/rules` - Listar reglas
- `POST /api/autopay/rules` - Crear regla
- `PUT /api/autopay/rules/:ruleId` - Actualizar regla
- `DELETE /api/autopay/rules/:ruleId` - Eliminar regla
- `POST /api/autopay/process-event` - Procesar evento
- `GET /api/autopay/stats` - Estadísticas

### Reputación
- `POST /api/update-reputation` - Actualizar score

### Verificación
- `POST /api/request-verification` - Solicitar verificación

### Reportes
- `POST /api/generate-report` - Generar informe

---

## ⚠️ Notas Importantes

1. **PRIVATE_KEY**: El backend necesita `PRIVATE_KEY` en `.env` para firmar transacciones
2. **MATIC**: El wallet del backend necesita MATIC para pagar gas
3. **Backend corriendo**: Asegúrate de que el backend esté en `http://localhost:3001`
4. **Reemplaza**: `TU_DIRECCION_WALLET` con tu dirección real (0x...)

---

## 🔗 Links Útiles

- **PolygonScan**: https://polygonscan.com
- **Contrato**: https://polygonscan.com/address/0x1D645cd86Ad6920132f5fa1081C20A677B854F3D
- **Backend Health**: http://localhost:3001/health

