# 🎯 EJECUTAR LOS 4 SERVICIOS PARA EL HACKATHON

## ✅ Configuración Actualizada

He cambiado los puertos del EVVM MATE Fisher para evitar conflictos:

- **OrigenMX Backend**: Puerto 3001 ✅
- **OrigenMX Frontend**: Puerto 3000 ✅
- **EVVM Backend**: Puerto 3002 ✅ (cambiado)
- **EVVM Frontend**: Puerto 3003 ✅ (cambiado)

## 🚀 EJECUTAR EN 4 TERMINALES

### Terminal 1: Backend OrigenMX
```bash
cd backend
npm run dev
```
✅ Debe mostrar: `Backend corriendo en http://localhost:3001`

### Terminal 2: Frontend OrigenMX
```bash
npm run dev
```
✅ Debe mostrar: `Local: http://localhost:3000`

### Terminal 3: Backend EVVM MATE Fisher
```bash
cd evvm-mate-fisher/backend
npm run dev
```
✅ Debe mostrar: `Backend corriendo en http://localhost:3002`

### Terminal 4: Frontend EVVM MATE Fisher
```bash
cd evvm-mate-fisher/frontend
npm run dev
```
✅ Debe mostrar: `Local: http://localhost:3003`

## 📱 URLs Finales

- **OrigenMX Dashboard**: http://localhost:3000
- **EVVM MATE Fisher**: http://localhost:3003
- **OrigenMX API**: http://localhost:3001
- **EVVM API**: http://localhost:3002

## ✅ Verificar que Todo Esté Corriendo

1. Abre http://localhost:3000 → Debe mostrar OrigenMX
2. Abre http://localhost:3003 → Debe mostrar EVVM MATE Fisher
3. Abre http://localhost:3001/health → Debe responder OK (OrigenMX)
4. Abre http://localhost:3002/health → Debe responder OK (EVVM)

## 🎯 Listo para el Hackathon!

Ambos proyectos están corriendo y listos para complementarse.
