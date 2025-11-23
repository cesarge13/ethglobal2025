# 📖 CÓMO USAR EVVM MATE FISHER - Paso a Paso

## ✅ Estado Actual

- ✅ Backend EVVM corriendo en: http://localhost:3002
- ⏳ Frontend EVVM instalando/iniciando...

## 🚀 CÓMO USAR (Paso a Paso)

### Paso 1: Esperar a que el Frontend termine de cargar

En la Terminal 4 deberías ver algo como:
```
- ready started server on 0.0.0.0:3003
- Local: http://localhost:3003
```

### Paso 2: Abrir el Frontend

Abre tu navegador en: **http://localhost:3003**

### Paso 3: Verás un Formulario Simple

El formulario tiene:
- **Input "Lot ID"**: Donde escribes el ID del lote (ej: "LOT-001")
- **Select "Tipo de Evento"**: Con 3 opciones:
  - HARVEST - Cosecha
  - SHIPPED - Enviado
  - STORAGE - Almacenamiento
- **Botón "Registrar Evento"**: Para enviar

### Paso 4: Registrar un Evento

1. Escribe un `lotId` (ej: "LOT-001" o "LOT-TEST-123")
2. Selecciona un `eventType` (HARVEST, SHIPPED, o STORAGE)
3. Haz clic en "Registrar Evento"
4. Espera unos segundos (la transacción se procesa en Polygon)
5. Verás el resultado con:
   - ✅ Mensaje de éxito
   - 📋 Lot ID registrado
   - 📋 Tipo de evento
   - 🔗 Transaction Hash (clickeable para ver en PolygonScan)
   - 📅 Timestamp

### Paso 5: Ver la Transacción en PolygonScan

Haz clic en el transaction hash para verlo en:
https://polygonscan.com/tx/[TX_HASH]

## 🎯 Ejemplo de Uso

1. Abre: http://localhost:3003
2. En "Lot ID" escribe: `LOT-001`
3. En "Tipo de Evento" selecciona: `HARVEST`
4. Haz clic en "Registrar Evento"
5. Espera 10-30 segundos (tiempo de confirmación en Polygon)
6. Verás el resultado con el hash de la transacción

## ⚠️ Importante

- Necesitas MATIC en tu wallet para pagar gas
- La transacción se ejecuta en Polygon Mainnet (real, no testnet)
- Cada evento registrado es permanente en blockchain
- El backend usa tu `RELAYER_PRIVATE_KEY` para firmar transacciones

## 🔍 Verificar que Funciona

1. Abre: http://localhost:3002/health
   - Debe responder: `{"status":"ok","service":"EVVM MATE Fisher Backend - Polygon Mainnet"}`

2. Abre: http://localhost:3003
   - Debe mostrar el formulario de registro

## 🐛 Si hay problemas

- Verifica que el backend esté corriendo (Terminal 3)
- Verifica que el frontend termine de instalar (Terminal 4)
- Revisa la consola del navegador (F12) para ver errores
- Revisa los logs en Terminal 3 para ver qué pasa
