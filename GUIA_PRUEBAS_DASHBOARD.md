# 🎯 Guía de Pruebas del Dashboard

> **Nota**: El backend ya tiene PRIVATE_KEY configurada. Solo inicia los servicios y prueba.

## 📋 Índice

1. [Herramientas Implementadas](#herramientas-implementadas)
2. [Qué Hacen tus Programas](#qué-hacen-tus-programas)
3. [Cómo Probar en el Dashboard](#cómo-probar-en-el-dashboard)
4. [Flujo Completo de Prueba](#flujo-completo-de-prueba)

---

## 🛠️ Herramientas Implementadas

### 1. **Smart Contract (Blockchain)**
- **Tecnología**: Solidity 0.8.20, Hardhat
- **Red**: Polygon Mainnet (Chain ID: 137)
- **Contrato**: `AgriculturalReputation.sol`
- **Dirección**: `0x1D645cd86Ad6920132f5fa1081C20A677B854F3D`
- **PolygonScan**: https://polygonscan.com/address/0x1D645cd86Ad6920132f5fa1081C20A677B854F3D

**Funciones principales:**
- Registro de agricultores
- Sistema de reputación (0-100)
- Registro de documentos con hash SHA256
- Verificaciones en 4 pasos (Identidad, Certificaciones, Almacén, Cultivo)
- Gestión de certificaciones (SAGARPA, SENASICA, Orgánico, BPA)
- Logging de pagos x402

### 2. **Backend API (TypeScript/Express)**
- **Tecnología**: Node.js, TypeScript, Express, ethers.js
- **Puerto**: 3001
- **Base URL**: `http://localhost:3001`

**Endpoints disponibles:**
- `GET /health` - Health check
- `GET /api/get-user-status/:address` - Estado del agricultor
- `POST /api/upload-docs` - Subir documentos
- `POST /api/request-verification` - Solicitar verificación
- `POST /api/execute-x402-payment` - Ejecutar micropago x402
- `GET /api/x402-rates` - Tarifas de micropagos
- `GET /api/x402-balance` - Balance del wallet de pagos
- `POST /api/update-reputation` - Actualizar reputación
- `POST /api/generate-report` - Generar informe
- `GET /api/llm-wallet/*` - Endpoints LLM Wallet MCP
- `GET /api/autopay/*` - Endpoints AutoPay Extension

### 3. **AI Agent (TypeScript)**
- **Tecnología**: TypeScript, OpenAI GPT-4o-mini, pdf-parse
- **Funciones**: Procesamiento de documentos, análisis con LLM, validación automática

**Comandos disponibles:**
- `npm run agent report <address>` - Generar informe
- `npm run agent validate <address> <document>` - Validar documento
- `npm run agent process <address> <folder>` - Procesar documentos

### 4. **Frontend Dashboard (React/Vite)**
- **Tecnología**: React, Vite, Wagmi, RainbowKit, Tailwind CSS
- **Puerto**: 3000
- **URL**: `http://localhost:3000`

**Componentes principales:**
- `FarmerDashboard` - Dashboard principal del agricultor
- `DocumentUpload` - Subida de documentos
- `ReputationScore` - Visualización de reputación
- `VerificationHistory` - Historial de verificaciones
- `X402Payments` - Gestión de micropagos

---

## 🎯 Qué Hacen tus Programas

### **Smart Contract (AgriculturalReputation.sol)**

**Propósito**: Almacenar en blockchain la reputación agrícola y documentos de los agricultores.

**Qué hace:**
1. ✅ Registra agricultores en Polygon Mainnet
2. ✅ Almacena score de reputación (0-100) on-chain
3. ✅ Registra documentos con hash SHA256 (inmutable)
4. ✅ Gestiona verificaciones en 4 pasos:
   - Paso 1: Identidad (INE, CURP, RFC)
   - Paso 2: Certificaciones (SAGARPA, SENASICA, Orgánico)
   - Paso 3: Almacén/Bodega
   - Paso 4: Cultivo/Cosecha
5. ✅ Registra certificaciones válidas
6. ✅ Logging de micropagos x402 ejecutados

**Ventajas:**
- 🔒 Datos inmutables en blockchain
- 🌐 Transparente y verificable
- 💰 Reputación usable para créditos/DeFi
- 📊 Historial completo on-chain

### **Backend API**

**Propósito**: Servir como intermediario entre el frontend y el smart contract, procesar documentos y ejecutar micropagos.

**Qué hace:**
1. ✅ Conecta con el Smart Contract via ethers.js
2. ✅ Procesa y almacena documentos (PDF, imágenes)
3. ✅ Genera hash SHA256 de documentos
4. ✅ Registra documentos en blockchain
5. ✅ Ejecuta micropagos x402 automáticamente
6. ✅ Actualiza reputación en blockchain
7. ✅ Genera informes de validación
8. ✅ Integración con LLM Wallet MCP
9. ✅ Integración con AutoPay Extension

**Flujo típico:**
```
Frontend → Backend API → Smart Contract → Polygon Mainnet
                ↓
         Procesa documentos
         Ejecuta micropagos
         Actualiza reputación
```

### **AI Agent**

**Propósito**: Analizar documentos agrícolas automáticamente usando IA.

**Qué hace:**
1. ✅ Lee documentos (PDF, imágenes)
2. ✅ Extrae texto con OCR si es necesario
3. ✅ Analiza contenido con OpenAI GPT-4o-mini
4. ✅ Valida información (identidad, certificaciones, etc.)
5. ✅ Ejecuta micropagos x402 por cada validación
6. ✅ Actualiza reputación en blockchain
7. ✅ Genera reportes de validación

**Proceso de validación:**
```
Documento → Procesamiento → Análisis LLM → Validación → Blockchain
                                    ↓
                            Micropago x402
```

### **Frontend Dashboard**

**Propósito**: Interfaz de usuario para que los agricultores gestionen su reputación.

**Qué hace:**
1. ✅ Conecta wallet de Polygon (MetaMask, RainbowKit)
2. ✅ Muestra dashboard con estadísticas:
   - Score de reputación (0-100)
   - Total de verificaciones
   - Certificaciones válidas
   - Estado de registro
3. ✅ Permite subir documentos:
   - Identidad (INE, CURP, RFC)
   - Certificaciones (SAGARPA, SENASICA, Orgánico)
   - Almacén/Bodega
   - Cultivo/Cosecha
4. ✅ Visualiza historial de verificaciones
5. ✅ Muestra documentos registrados
6. ✅ Gestiona micropagos x402
7. ✅ Solicita verificaciones

---

## 🧪 Cómo Probar en el Dashboard

### **Paso 1: Preparar el Entorno**

**✅ IMPORTANTE**: El backend ya tiene PRIVATE_KEY configurada en `backend/.env`. Solo necesitas iniciar los servicios.

```bash
# Terminal 1: Inicia el Backend
cd backend
npm run dev
# ✅ Debería mostrar: "🚀 Backend server running on port 3001"
# ✅ Debería mostrar todos los endpoints disponibles

# Terminal 2: Inicia el Frontend
npm run dev
# ✅ Debería mostrar: "Local: http://localhost:3000"
# ✅ Abre automáticamente en el navegador
```

**Verifica que ambos estén corriendo:**
- Backend: http://localhost:3001/health (debe responder con JSON)
- Frontend: http://localhost:3000 (debe mostrar el dashboard)

### **Paso 2: Conectar Wallet**

1. **Abre el dashboard**: http://localhost:3000
   - Si no se abre automáticamente, ábrelo manualmente en tu navegador

2. **Conecta tu wallet**:
   - Haz clic en el botón **"Connect Wallet"** en el header (arriba a la derecha)
   - Selecciona **MetaMask** o tu wallet preferida
   - Acepta la conexión en tu wallet
   - **IMPORTANTE**: Debes estar en **Polygon Mainnet** (Chain ID: 137)
   
3. **Si no tienes Polygon Mainnet configurado en MetaMask**:
   - Ve a MetaMask → Settings → Networks → Add Network
   - O usa estos datos:
     - **Network Name**: Polygon Mainnet
     - **RPC URL**: https://polygon-rpc.com
     - **Chain ID**: 137
     - **Currency**: MATIC
     - **Block Explorer**: https://polygonscan.com

4. **Verifica la conexión**:
   - Deberías ver tu dirección de wallet en el header
   - El dashboard debería cambiar y mostrar contenido

### **Paso 3: Navegar al Dashboard Agrícola**

1. **En el Sidebar** (menú lateral izquierdo), busca **"Validación Agrícola"**
   - Es el segundo elemento del menú
   - Tiene un ícono de escudo 🛡️
   - Haz clic en él

2. **Verifica que cargue el dashboard**:
   - Deberías ver el título "Dashboard del Agricultor"
   - Verás 4 cards de estadísticas:
     - **Reputación**: Score de 0-100
     - **Verificaciones**: Total de verificaciones
     - **Certificaciones**: Certificaciones válidas
     - **Estado**: Registrado/No Registrado
   
3. **Verifica los Tabs**:
   - Deberías ver 3 tabs: **"Documentos"**, **"Reputación"**, **"Historial"**
   - El tab **"Documentos"** debería estar seleccionado por defecto
   - Si no ves los tabs, verifica que tu wallet esté conectada

4. **Si ves un mensaje de error**:
   - Verifica que el backend esté corriendo
   - Verifica la consola del navegador (F12) para ver errores
   - Asegúrate de tener el archivo `.env` con `VITE_API_URL=http://localhost:3001`

### **Paso 4: Ver tu Estado Actual**

Al entrar al dashboard, automáticamente:
- ✅ Se carga tu estado desde el Smart Contract
- ✅ Se muestra tu score de reputación (si estás registrado)
- ✅ Se muestran tus documentos registrados
- ✅ Se muestra tu historial de verificaciones

**Si no estás registrado:**
- Verás "No Registrado" en el card de Estado
- Score de reputación será 0
- No habrá documentos ni verificaciones

### **Paso 5: Subir Documentos**

**IMPORTANTE**: Asegúrate de que el backend esté corriendo antes de subir documentos.

1. **Ve al tab "Documentos"** (debería estar seleccionado por defecto)
   - Si no ves el tab, verifica que tu wallet esté conectada
   - El tab "Documentos" es el primero de los tres tabs disponibles

2. **Verifica que veas el formulario de subida**:
   - Deberías ver un card con título "Subir Documentos" (con ícono de upload)
   - Un selector de "Tipo de Documento"
   - Un input de archivos (dice "Seleccionar Archivos")
   - Un botón "Subir Documentos" (deshabilitado hasta seleccionar archivos)

3. **Selecciona el tipo de documento**:
   - Haz clic en el selector "Tipo de Documento"
   - Selecciona una opción:
     - **Identidad** (INE, CURP, RFC)
     - **Certificación** (SAGARPA, SENASICA, Orgánico)
     - **Almacén/Bodega**
     - **Cultivo/Cosecha**

4. **Selecciona archivos**:
   - Haz clic en el input de archivos (dice "Seleccionar Archivos")
   - O arrastra archivos directamente al área
   - Formatos soportados: **PDF, JPEG, PNG**
   - Máximo 10 archivos, 10MB cada uno
   - **Después de seleccionar**, verás la lista de archivos seleccionados en un recuadro gris

5. **Haz clic en "Subir Documentos"**:
   - El botón se habilita automáticamente cuando seleccionas archivos
   - Verás un spinner y "Subiendo documentos..." mientras se suben
   - Espera a que termine el proceso (puede tomar unos segundos)

6. **Verifica el resultado**:
   - ✅ Deberías ver un mensaje de éxito: "✅ Documentos registrados exitosamente"
   - ✅ Aparecerá una nueva card "Resultados de la Subida"
   - ✅ Cada documento tendrá un estado (Registrado/Error)
   - ✅ Si se registró correctamente, verás un link "Ver TX" que lleva a PolygonScan
   - ✅ El dashboard se actualiza automáticamente con los nuevos documentos

**Si NO ves el formulario de subida:**
- Verifica que estés en el tab "Documentos" (no en "Reputación" o "Historial")
- Verifica que tu wallet esté conectada
- Verifica que el backend esté corriendo (puerto 3001)
- Revisa la consola del navegador (F12) para ver errores
- Verifica que tengas el archivo `.env` con `VITE_API_URL=http://localhost:3001`

### **Paso 6: Solicitar Verificación**

1. **Después de subir documentos**, puedes solicitar verificación
2. El sistema automáticamente:
   - ✅ Valida que el agricultor esté registrado
   - ✅ Prepara los documentos para verificación
   - ✅ Genera un ID de verificación

**Nota**: La verificación completa requiere que el AI Agent procese los documentos.

### **Paso 7: Ver Reputación**

1. **Ve al tab "Reputación"**
2. Verás:
   - Score actual (0-100)
   - Barra de progreso
   - Información detallada
   - Opción para actualizar (requiere permisos de owner)

**El score se actualiza automáticamente cuando:**
- Se completan verificaciones
- Se validan certificaciones
- El AI Agent procesa documentos

### **Paso 8: Ver Historial**

1. **Ve al tab "Historial"**
2. Verás:
   - Historial de verificaciones
   - Documentos registrados
   - Fechas y estados
   - Links a transacciones en PolygonScan

---

## 🔄 Flujo Completo de Prueba

### **Escenario 1: Agricultor Nuevo (Primera Vez)**

```
1. Conecta wallet → Dashboard muestra "No Registrado"
2. Sube documento de identidad (INE) → Se registra en blockchain
3. Solicita verificación → Se genera ID de verificación
4. AI Agent procesa → Valida identidad → Ejecuta micropago x402
5. Reputación se actualiza → Score aumenta (ej: 25/100)
6. Sube certificación → Se registra en blockchain
7. AI Agent valida certificación → Ejecuta micropago → Score aumenta (ej: 50/100)
8. Completa los 4 pasos → Score final (ej: 85/100)
```

### **Escenario 2: Agricultor Registrado**

```
1. Conecta wallet → Dashboard muestra estado actual
2. Ve score de reputación → Ej: 75/100
3. Ve documentos registrados → Lista de documentos con hashes
4. Ve historial → Verificaciones pasadas
5. Sube nuevo documento → Se agrega a la lista
6. Score puede aumentar si el documento mejora la reputación
```

### **Escenario 3: Verificar Transacciones en Blockchain**

```
1. Después de subir documento → Ver hash de transacción
2. Haz clic en "Ver TX" → Se abre PolygonScan
3. En PolygonScan verás:
   - Transacción de registro de documento
   - Hash del documento
   - Gas usado
   - Estado (Success)
4. Puedes verificar que el documento está en blockchain
```

---

## 🎨 Componentes del Dashboard

### **FarmerDashboard**
- **Ubicación**: Sidebar → "Validación Agrícola"
- **Qué muestra**:
  - Cards de estadísticas (4 cards)
  - Tabs: Documentos, Reputación, Historial
  - Estado del agricultor en tiempo real

### **DocumentUpload**
- **Ubicación**: Tab "Documentos" en FarmerDashboard
- **Funcionalidad**:
  - Selector de tipo de documento
  - Input de archivos (múltiple)
  - Botón de subida
  - Resultados de subida con links a PolygonScan

### **ReputationScore**
- **Ubicación**: Tab "Reputación" en FarmerDashboard
- **Funcionalidad**:
  - Visualización de score (0-100)
  - Barra de progreso
  - Información detallada

### **VerificationHistory**
- **Ubicación**: Tab "Historial" en FarmerDashboard
- **Funcionalidad**:
  - Lista de verificaciones
  - Lista de documentos
  - Fechas y estados

---

## 🔍 Verificación de Funcionamiento

### **Checklist de Prueba**

- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 3000
- [ ] Wallet conectada a Polygon Mainnet
- [ ] Dashboard muestra estado del agricultor
- [ ] Puedo subir documentos
- [ ] Los documentos se registran en blockchain
- [ ] Veo los hashes de transacción
- [ ] Puedo ver mi score de reputación
- [ ] Puedo ver mi historial de verificaciones
- [ ] Los links a PolygonScan funcionan

### **Comandos de Verificación**

```bash
# Verificar backend
curl http://localhost:3001/health

# Verificar estado de agricultor (reemplaza ADDRESS)
curl http://localhost:3001/api/get-user-status/0xTU_DIRECCION

# Verificar tarifas x402
curl http://localhost:3001/api/x402-rates

# Verificar balance x402
curl http://localhost:3001/api/x402-balance
```

---

## 🐛 Troubleshooting

### **Problema: No puedo conectar wallet**
- **Solución**: Asegúrate de tener MetaMask instalado y configurado para Polygon Mainnet

### **Problema: Dashboard muestra "Error al cargar información"**
- **Solución**: 
  1. Verifica que el backend esté corriendo
  2. Verifica que la dirección del wallet sea correcta
  3. Revisa la consola del navegador para errores

### **Problema: No puedo subir documentos**
- **Solución**:
  1. Verifica que el backend esté corriendo
  2. Verifica que los archivos sean del formato correcto (PDF, JPEG, PNG)
  3. Verifica que el tamaño no exceda 10MB

### **Problema: No veo transacciones en PolygonScan**
- **Solución**:
  1. Verifica que estés en Polygon Mainnet (no testnet)
  2. Espera unos segundos para que la transacción se confirme
  3. Verifica que tengas MATIC para gas fees

---

## 📚 Recursos Adicionales

- **Smart Contract en PolygonScan**: https://polygonscan.com/address/0x1D645cd86Ad6920132f5fa1081C20A677B854F3D
- **Backend API Docs**: http://localhost:3001 (ver endpoints disponibles)
- **Documentación completa**: Ver `README_ETHGLOBAL.md`, `TESTING.md`, `DEPLOYMENT.md`

---

**¡Listo para probar! 🚀**

