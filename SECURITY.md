# 🔒 Guía de Seguridad - Private Keys

## ✅ Estado Actual

**BUENAS NOTICIAS**: Tus archivos `.env` con PRIVATE_KEYs **NO están en el repositorio Git**.

El `.gitignore` está configurado correctamente y está protegiendo tus keys.

## ⚠️ Verificación Importante

**POR FAVOR VERIFICA AHORA:**

1. Ve a tu repositorio: https://github.com/cesarge13/ethglobal2025
2. Busca si hay algún archivo `.env` visible
3. Busca si hay PRIVATE_KEYs hardcodeadas en el código

### Cómo buscar en GitHub:

1. En la página del repositorio, usa la búsqueda: `PRIVATE_KEY`
2. Busca archivos `.env` en el código
3. Si encuentras algo, **ACCIÓN INMEDIATA REQUERIDA** (ver abajo)

## 🚨 Si Encontraste PRIVATE_KEYs Expuestas

### PASOS CRÍTICOS (hacer INMEDIATAMENTE):

1. **ROTAR las keys inmediatamente:**
   ```bash
   # Crear nueva wallet
   # Transfiere TODOS los fondos a la nueva wallet
   # Actualiza PRIVATE_KEY en tus .env locales
   ```

2. **Eliminar del historial de Git:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env backend/.env smart-contracts/.env agent/.env" \
     --prune-empty --tag-name-filter cat -- --all
   
   git push origin --force --all
   ```

3. **Cambiar todas las keys relacionadas:**
   - PolygonScan API Key (si estaba expuesta)
   - WalletConnect Project ID (si era privado)
   - Cualquier otra credencial

## ✅ Buenas Prácticas

### ✅ HACER:

- ✅ Usar archivos `.env` locales (nunca subirlos a Git)
- ✅ Usar `.env.template` como ejemplo (sin keys reales)
- ✅ Verificar `.gitignore` antes de cada commit
- ✅ Usar variables de entorno en producción
- ✅ Rotar keys periódicamente

### ❌ NO HACER:

- ❌ NUNCA hardcodear PRIVATE_KEYs en el código
- ❌ NUNCA subir archivos `.env` a Git
- ❌ NUNCA compartir PRIVATE_KEYs en mensajes/emails
- ❌ NUNCA usar la misma key en múltiples proyectos
- ❌ NUNCA dejar keys en logs o consola

## 📁 Estructura de Archivos Segura

```
proyecto/
├── .env                    # ⚠️ LOCAL SOLO - NUNCA en Git
├── .env.template          # ✅ Template sin keys - OK en Git
├── backend/
│   ├── .env               # ⚠️ LOCAL SOLO
│   └── .env.template      # ✅ Template - OK en Git
└── smart-contracts/
    ├── .env               # ⚠️ LOCAL SOLO
    └── .env.template      # ✅ Template - OK en Git
```

## 🔍 Verificación Continua

Antes de cada commit, verifica:

```bash
# Ver qué archivos se van a subir
git status

# Buscar PRIVATE_KEYs en archivos que se van a commitear
git diff --cached | grep -i "PRIVATE_KEY\|0x[a-fA-F0-9]\{64\}"

# Si encuentras algo, NO HAGAS COMMIT
```

## 📝 Configuración Correcta de .gitignore

Tu `.gitignore` ya incluye:

```
.env
.env.local
.env.*.local
**/.env
```

Esto protege todos los archivos `.env` en cualquier nivel del proyecto.

## 🆘 Si Necesitas Ayuda

Si encuentras keys expuestas:

1. **INMEDIATAMENTE**: Transfiere fondos a una nueva wallet
2. **LUEGO**: Elimina las keys del historial de Git
3. **FINALMENTE**: Actualiza todas las referencias

---

**Recuerda**: Una vez que una PRIVATE_KEY está en Git, está en el historial para siempre. La única solución es rotar la key.

