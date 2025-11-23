# 🚀 Iniciar Backend EVVM MATE

## ⚠️ IMPORTANTE: Conflicto de Puertos Resuelto

El backend principal de OrigenMX está usando el puerto **3001**, por lo que el backend de EVVM MATE ahora usa el puerto **3002**.

## 📋 Pasos para Iniciar

### 1. Detener cualquier proceso en puerto 3002 (si existe)
```bash
lsof -ti:3002 | xargs kill -9
```

### 2. Navegar al directorio del backend
```bash
cd evvm-mate-fisher/backend
```

### 3. Verificar configuración
Asegúrate de tener el archivo `.env` configurado:
```env
RELAYER_PRIVATE_KEY=tu_clave_privada_sin_prefijo_0x
POLYGON_RPC_URL=https://polygon-rpc.com
PORT=3002
EVVM_EXECUTOR_ADDRESS=0x9902984d86059234c3B6e11D5eAEC55f9627dD0f
```

### 4. Iniciar el backend
```bash
npm start
```

O en modo desarrollo con auto-reload:
```bash
npm run dev
```

### 5. Verificar que está corriendo
Deberías ver:
```
🚀 EVVM MATE Fisher Backend corriendo en http://localhost:3002
🌐 Red: Polygon Mainnet
📋 Endpoints disponibles:
   GET  /health
   POST /registerEvent
```

### 6. Probar el endpoint
```bash
curl http://localhost:3002/health
```

Debería responder:
```json
{"status":"ok","service":"EVVM MATE Fisher Backend - Polygon Mainnet"}
```

## 🔧 Configuración del Frontend

El componente `EVVMMate.tsx` está configurado para usar `http://localhost:3002` por defecto.

Si necesitas cambiar la URL, puedes crear un archivo `.env` en la raíz del proyecto:
```env
VITE_EVVM_API_URL=http://localhost:3002
```

## ✅ Verificación Completa

1. ✅ Backend principal corriendo en puerto 3001
2. ✅ Backend EVVM MATE corriendo en puerto 3002
3. ✅ Frontend configurado para usar puerto 3002
4. ✅ Endpoint `/health` responde correctamente
5. ✅ Endpoint `/registerEvent` está disponible

## 🐛 Troubleshooting

### Error: "Port 3002 already in use"
```bash
lsof -ti:3002 | xargs kill -9
```

### Error: "Cannot POST /registerEvent"
- Verifica que el backend esté corriendo: `curl http://localhost:3002/health`
- Verifica que estés usando el puerto correcto (3002, no 3001)

### Error: "RELAYER_PRIVATE_KEY no configurada"
- Verifica que el archivo `.env` existe en `evvm-mate-fisher/backend/`
- Verifica que `RELAYER_PRIVATE_KEY` esté configurada (sin prefijo 0x)

