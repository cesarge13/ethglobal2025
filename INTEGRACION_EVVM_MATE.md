# 🌾 Integración EVVM MATE en Dashboard OrigenMX

## ✅ Estado de la Integración

La funcionalidad de **EVVM MATE Fisher** ha sido integrada completamente en el dashboard principal de OrigenMX.

### Componentes Integrados

1. **Componente EVVMMate.tsx** - Componente React/TypeScript integrado en el dashboard
2. **Nueva pantalla "EVVM MATE"** - Agregada al menú lateral y navegación
3. **Backend EVVM MATE** - Servicio independiente que corre en el puerto 3001

## 🚀 Cómo Usar

### 1. Iniciar el Backend de EVVM MATE

El backend debe estar corriendo para que el dashboard pueda registrar eventos:

```bash
cd evvm-mate-fisher/backend
npm install
npm start
```

El backend estará disponible en: `http://localhost:3002`

### 2. Configurar Variables de Entorno del Backend

Crea un archivo `.env` en `evvm-mate-fisher/backend/`:

```env
RELAYER_PRIVATE_KEY=tu_clave_privada_sin_prefijo_0x
POLYGON_RPC_URL=https://polygon-rpc.com
# O usa un RPC más confiable como:
# POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/TU_INFURA_KEY
PORT=3002
EVVM_EXECUTOR_ADDRESS=0x9902984d86059234c3B6e11D5eAEC55f9627dD0f
```

**⚠️ IMPORTANTE:**
- La `RELAYER_PRIVATE_KEY` debe ser de un wallet con MATIC en Polygon Mainnet
- NO subas el archivo `.env` a Git
- Puedes obtener MATIC desde: https://faucet.polygon.technology/

### 3. Iniciar el Dashboard Principal

```bash
npm install
npm run dev
```

El dashboard estará disponible en: `http://localhost:3000`

### 4. Usar EVVM MATE desde el Dashboard

1. Abre el dashboard en `http://localhost:3000`
2. Haz clic en **"EVVM MATE"** en el menú lateral
3. Ingresa un `lotId` (ej: "LOT-001")
4. Selecciona un tipo de evento:
   - 🌾 **HARVEST** - Cosecha
   - 🚚 **SHIPPED** - Enviado
   - 📦 **STORAGE** - Almacenamiento
5. Haz clic en **"Registrar Evento en MATE EVVM"**
6. Espera la confirmación de la transacción en Polygon
7. Verás el transaction hash y un enlace a Polygonscan

## 🔧 Configuración del Frontend

El componente `EVVMMate.tsx` está configurado para conectarse al backend en:
- URL por defecto: `http://localhost:3002`
- Variable de entorno: `VITE_EVVM_API_URL` (opcional)

Si necesitas cambiar la URL del backend, puedes:

1. Crear un archivo `.env` en la raíz del proyecto:
```env
VITE_EVVM_API_URL=http://localhost:3002
```

2. O modificar directamente en `src/components/EVVMMate.tsx`:
```typescript
const API_URL = import.meta.env.VITE_EVVM_API_URL || 'http://localhost:3002';
```

## 🌐 Redes Soportadas

- **Polygon Mainnet** - Red principal donde se registran los eventos
- Los eventos se registran usando el protocolo **MATE EVVM (EVVM ID: 2)**
- Las transacciones se pueden verificar en: https://polygonscan.com

## 📋 Flujo de Integración

```
Dashboard (Puerto 3000)
    ↓
Componente EVVMMate.tsx
    ↓
Backend EVVM MATE (Puerto 3002)
    ↓
Executor Contract en Polygon Mainnet
    ↓
MATE EVVM Metaprotocol (EVVM ID: 2)
    ↓
Blockchain (Inmutable)
```

## 🎯 Características Integradas

✅ Formulario para registrar eventos agrícolas
✅ Validación de campos requeridos
✅ Estados de carga y error
✅ Confirmación de transacciones
✅ Enlaces a Polygonscan para verificar transacciones
✅ Diseño consistente con el dashboard principal
✅ Soporte para modo oscuro
✅ Integración con Polygon Mainnet

## 🐛 Troubleshooting

### Error: "Failed to fetch" o "Network error"

- Verifica que el backend esté corriendo en `http://localhost:3002`
- Verifica que `VITE_EVVM_API_URL` esté configurado correctamente (debe ser `http://localhost:3002`)
- Revisa la consola del navegador para más detalles

### Error: "RELAYER_PRIVATE_KEY no configurada"

- Verifica que el archivo `.env` existe en `evvm-mate-fisher/backend/`
- Verifica que `RELAYER_PRIVATE_KEY` esté configurada
- La clave NO debe tener prefijo `0x`

### Error: "Wallet sin fondos"

- Necesitas MATIC en Polygon Mainnet para pagar gas
- Obtén MATIC desde: https://faucet.polygon.technology/
- Verifica el balance en: https://polygonscan.com

### El componente no aparece en el menú

- Verifica que hayas reiniciado el servidor de desarrollo
- Verifica que no haya errores en la consola del navegador
- Verifica que `src/components/EVVMMate.tsx` existe

## 📝 Notas para el Hackathon

- ✅ La integración está completa y funcional
- ✅ El componente está integrado en el dashboard principal
- ✅ Usa Polygon Mainnet para producción
- ✅ Los eventos quedan registrados permanentemente en blockchain
- ✅ Compatible con el diseño existente del dashboard

## 🔗 Enlaces Útiles

- **Polygonscan**: https://polygonscan.com
- **Polygon Faucet**: https://faucet.polygon.technology/
- **Executor Contract**: `0x9902984d86059234c3B6e11D5eAEC55f9627dD0f`
- **EVVM ID**: 2 (MATE)

---

**Integración completada para el hackathon** 🎉

