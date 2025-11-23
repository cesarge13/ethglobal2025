# 📋 Resumen de Integraciones - OrigenMX Dashboard

## 🔗 1. Polygon Blockchain (Smart Contracts & Créditos)

### ¿Qué hace?
Polygon es la blockchain principal donde se ejecutan los smart contracts del sistema de créditos agrícolas.

### ¿Cómo funciona?
- **Conexión de Wallet**: Los usuarios conectan su wallet (MetaMask, WalletConnect) usando Wagmi/RainbowKit
- **Redes Soportadas**: 
  - Polygon Mainnet (producción)
  - Polygon Amoy (testnet)
- **Smart Contracts**: 
  - `CreditVault` - Gestiona los créditos agrícolas
  - `AgriculturalReputation` - Sistema de reputación basado en AgroScore
- **Transacciones**: 
  - Solicitud de créditos
  - Pagos de cuotas
  - Actualización de reputación
  - Todo se registra en blockchain (inmutable y transparente)

### Flujo:
```
Usuario → Conecta Wallet → Selecciona Polygon → Interactúa con Smart Contracts → Transacción en Blockchain
```

---

## 🌾 2. EVVM MATE (Registro de Eventos Agrícolas)

### ¿Qué hace?
Protocolo para registrar eventos agrícolas (cosecha, envío, almacenamiento) directamente en blockchain usando el metaprotocolo MATE EVVM.

### ¿Cómo funciona?
- **Backend Independiente**: Servicio Node.js corriendo en puerto 3002
- **Executor Contract**: Contrato desplegado en Polygon Mainnet (`0x9902984d...`)
- **EVVM ID**: 2 (identificador del protocolo MATE)
- **Tipos de Eventos**:
  - 🌾 HARVEST (Cosecha)
  - 🚚 SHIPPED (Enviado)
  - 📦 STORAGE (Almacenamiento)

### Flujo:
```
Dashboard → Componente EVVMMate → Backend (puerto 3002) → Executor Contract → Polygon Mainnet → MATE EVVM Protocol
```

### Proceso técnico:
1. Usuario ingresa `lotId` y `eventType` en el dashboard
2. Frontend envía POST a `/registerEvent` del backend
3. Backend construye payload JSON: `{lotId, eventType, timestamp}`
4. Backend convierte JSON a bytes (UTF-8)
5. Backend llama `executeWithNonce()` en el executor contract
6. Transacción se confirma en Polygon
7. Se retorna `txHash` y enlace a Polygonscan

### Características:
- ✅ Registro inmutable en blockchain
- ✅ Verificable en Polygonscan
- ✅ Integrado con el sistema de AgroScore
- ✅ Usa relayer wallet para pagar gas

---

## 💼 3. Wagmi + RainbowKit (Conexión de Wallets)

### ¿Qué hace?
Proporciona la infraestructura para conectar wallets de usuarios y interactuar con blockchain.

### ¿Cómo funciona?
- **Wagmi**: Librería React para interactuar con Ethereum/Polygon
- **RainbowKit**: UI pre-construida para conexión de wallets
- **Soporte Multi-Wallet**: MetaMask, WalletConnect, Coinbase Wallet, etc.
- **Gestión de Redes**: Permite cambiar entre Polygon Mainnet, Amoy, Base, etc.

### Componentes:
- `WagmiProviderWrapper`: Envuelve toda la app con providers de blockchain
- `WalletConnect`: Botón de conexión en el Header
- `useAccount`: Hook para obtener dirección del wallet conectado
- `useBalance`: Hook para obtener balance de MATIC/USDC

### Flujo:
```
App → WagmiProvider → RainbowKitProvider → Usuario conecta wallet → Acceso a funciones blockchain
```

---

## 📦 4. Filecoin (Almacenamiento de Evidencia)

### ¿Qué hace?
Almacena documentos y evidencia de los lotes agrícolas de forma descentralizada.

### ¿Cómo funciona?
- **Synapse SDK**: Integración con Filecoin Onchain Cloud
- **CID (Content Identifier)**: Cada archivo tiene un hash único
- **Evidencia de Lotes**: PDFs, imágenes, certificados se almacenan en Filecoin
- **Verificación**: Los CID se guardan en blockchain para verificación

### Ejemplo:
```typescript
evidenceFile: {
  filecoinCID: 'bafybeic7qz2kyolnipf2cwvqb6hqsohsrjfl4t5efnpmjvlpgskwrrzuai'
}
```

---

## 🔄 Flujo Completo del Sistema

### Escenario: Un agricultor solicita un crédito

1. **Registro de Lote**:
   - Sube documentos → Filecoin (almacena evidencia)
   - Registra eventos → EVVM MATE (cosecha, envío, etc.)

2. **Cálculo de AgroScore**:
   - Sistema analiza eventos de EVVM MATE
   - Calcula score de reputación
   - Guarda en `AgriculturalReputation` contract (Polygon)

3. **Solicitud de Crédito**:
   - Usuario conecta wallet (Wagmi/RainbowKit)
   - Selecciona lote con buen AgroScore
   - Interactúa con `CreditVault` contract (Polygon)
   - Smart contract aprueba/deniega basado en reputación

4. **Gestión de Pagos**:
   - Cuotas automáticas vía x402 Autopay Agent
   - Pagos se registran en Polygon
   - Reputación se actualiza automáticamente

---

## 🎯 Resumen Visual

```
┌─────────────────────────────────────────────────────────┐
│                    DASHBOARD (Frontend)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Wagmi/   │  │ EVVM MATE │  │ Credits  │  │ Filecoin│ │
│  │RainbowKit│  │ Component │  │ Component│  │  Upload │ │
│  └────┬─────┘  └─────┬─────┘  └────┬─────┘  └────┬────┘ │
└───────┼──────────────┼─────────────┼─────────────┼──────┘
        │              │             │             │
        ▼              ▼             ▼             ▼
┌─────────────────────────────────────────────────────────┐
│                    BLOCKCHAIN LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Polygon    │  │  EVVM MATE   │  │   Filecoin   │   │
│  │  Mainnet     │  │  Executor    │  │  Storage     │   │
│  │              │  │  (Polygon)   │  │              │   │
│  │ • CreditVault│  │              │  │ • Evidence   │   │
│  │ • Reputation │  │ • Events     │  │ • Documents  │   │
│  │ • Payments   │  │ • Immutable  │  │ • CID Hashes │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Puntos Clave

1. **Polygon** = Blockchain principal para smart contracts y créditos
2. **EVVM MATE** = Protocolo para eventos agrícolas (backend separado en puerto 3001)
3. **Wagmi/RainbowKit** = Conexión de wallets y acceso a blockchain
4. **Filecoin** = Almacenamiento descentralizado de documentos
5. **Todo integrado** = Dashboard unificado que conecta todas las piezas

---

## 🚀 Para el Hackathon

✅ **Todo está integrado y funcionando**
✅ **Polygon Mainnet** para producción
✅ **EVVM MATE** registrando eventos en blockchain
✅ **Wallets** conectables vía RainbowKit
✅ **Filecoin** para evidencia inmutable

**El sistema completo permite:**
- Registrar lotes agrícolas
- Calcular reputación (AgroScore)
- Solicitar créditos basados en blockchain
- Gestionar pagos automáticos
- Todo verificable y transparente

