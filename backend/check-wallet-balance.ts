import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function checkWallet() {
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  // Intentar múltiples RPC endpoints
  const RPC_URLS = [
    process.env.POLYGON_RPC_URL,
    'https://polygon-rpc.com',
    'https://rpc.ankr.com/polygon',
    'https://polygon.llamarpc.com'
  ].filter(Boolean) as string[];
  
  let provider: ethers.JsonRpcProvider | null = null;
  let lastError: Error | null = null;
  let workingRpc = '';
  
  // Intentar conectar con cada RPC
  for (const rpcUrl of RPC_URLS) {
    try {
      console.log(`🔄 Intentando conectar con: ${rpcUrl}...`);
      provider = new ethers.JsonRpcProvider(rpcUrl, {
        name: 'polygon',
        chainId: 137,
      });
      // Test de conexión rápida
      await provider.getBlockNumber();
      console.log(`✅ Conectado exitosamente a: ${rpcUrl}\n`);
      workingRpc = rpcUrl;
      break;
    } catch (error: any) {
      lastError = error;
      console.log(`❌ Falló: ${error.message}`);
      continue;
    }
  }
  
  if (!provider) {
    console.error('❌ No se pudo conectar a ningún RPC endpoint');
    console.error('   Último error:', lastError?.message);
    process.exit(1);
  }
  
  if (!PRIVATE_KEY) {
    console.error('❌ PRIVATE_KEY no configurada en .env');
    process.exit(1);
  }

  try {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    console.log('🔍 Verificando wallet del backend...\n');
    console.log('📍 Dirección del wallet:', wallet.address);
    console.log('🌐 RPC URL:', workingRpc);
    
    const balance = await provider.getBalance(wallet.address);
    const balanceInMatic = ethers.formatEther(balance);
    
    console.log('💰 Balance:', balanceInMatic, 'MATIC');
    
    if (balance === 0n) {
      console.log('\n⚠️  ADVERTENCIA: El wallet no tiene MATIC!');
      console.log('   Necesitas enviar MATIC a esta dirección para pagar gas fees.');
      console.log(`   Dirección: ${wallet.address}`);
      console.log('\n💡 Puedes enviar MATIC desde MetaMask o cualquier exchange.');
    } else {
      const balanceNum = parseFloat(balanceInMatic);
      if (balanceNum < 0.01) {
        console.log('\n⚠️  ADVERTENCIA: Balance muy bajo!');
        console.log('   Puede que no tengas suficiente MATIC para múltiples transacciones.');
      } else {
        console.log('\n✅ El wallet tiene MATIC suficiente para transacciones');
      }
    }
    
    // Verificar conexión con el contrato
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    if (CONTRACT_ADDRESS) {
      console.log('\n🔍 Verificando contrato...');
      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === '0x') {
        console.log('⚠️  ADVERTENCIA: El contrato no está desplegado en la dirección configurada');
        console.log(`   Dirección configurada: ${CONTRACT_ADDRESS}`);
      } else {
        console.log('✅ El contrato está desplegado y accesible');
        console.log(`   Dirección: ${CONTRACT_ADDRESS}`);
        console.log(`   PolygonScan: https://polygonscan.com/address/${CONTRACT_ADDRESS}`);
      }
    }
    
    console.log('\n📊 Resumen:');
    console.log(`   Wallet: ${wallet.address}`);
    console.log(`   Balance: ${balanceInMatic} MATIC`);
    console.log(`   RPC: ${workingRpc}`);
    console.log(`   Contrato: ${CONTRACT_ADDRESS || 'No configurado'}`);
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkWallet();
