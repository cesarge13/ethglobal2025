# 🚀 EJECUTAR TODOS LOS SERVICIOS PARA EL HACKATHON

Necesitas ejecutar **4 servicios** en total (2 proyectos):

## 📋 Servicios Necesarios

### Proyecto 1: OrigenMX
1. **Backend OrigenMX** - Puerto 3001
2. **Frontend OrigenMX** - Puerto 3000

### Proyecto 2: EVVM MATE Fisher
3. **Backend EVVM** - Puerto 3001 (⚠️ CONFLICTO!)
4. **Frontend EVVM** - Puerto 3000 (⚠️ CONFLICTO!)

## ⚠️ PROBLEMA: Conflictos de Puerto

Ambos proyectos usan los mismos puertos. Necesitamos cambiar los puertos del EVVM MATE Fisher.

## ✅ SOLUCIÓN: Cambiar Puertos del EVVM

EVVM MATE Fisher usará:
- Backend: Puerto **3002**
- Frontend: Puerto **3003**

## 🚀 CÓMO EJECUTAR (4 Terminales)

### Terminal 1: Backend OrigenMX
```bash
cd backend
npm install  # Solo la primera vez
npm run dev
```
✅ Debe estar en: http://localhost:3001

### Terminal 2: Frontend OrigenMX
```bash
npm install  # Solo la primera vez
npm run dev
```
✅ Debe estar en: http://localhost:3000

### Terminal 3: Backend EVVM MATE Fisher
```bash
cd evvm-mate-fisher/backend
npm install  # Solo la primera vez
npm run dev
```
✅ Debe estar en: http://localhost:3002

### Terminal 4: Frontend EVVM MATE Fisher
```bash
cd evvm-mate-fisher/frontend
npm install  # Solo la primera vez
npm run dev
```
✅ Debe estar en: http://localhost:3003

## 📱 URLs Finales

- **OrigenMX Frontend**: http://localhost:3000
- **OrigenMX Backend**: http://localhost:3001
- **EVVM Frontend**: http://localhost:3003
- **EVVM Backend**: http://localhost:3002

## ⚙️ Configuración Necesaria

1. Cambiar puerto del backend EVVM a 3002
2. Cambiar puerto del frontend EVVM a 3003
3. Actualizar frontend EVVM para apuntar al backend en 3002
