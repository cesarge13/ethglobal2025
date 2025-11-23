import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../smart-contracts/.env") });

/**
 * Script para verificar la wallet y obtener la dirección Ethereum/Polygon
 */
async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.POLYGON_RPC_URL || "https://polygon-rpc.com";

  if (!privateKey) {
    console.error("❌ PRIVATE_KEY no configurada");
    process.exit(1);
  }

  try {
    console.log("🔍 Verificando wallet...\n");

    // Crear wallet desde private key
    const wallet = new ethers.Wallet(privateKey);
    const address = wallet.address;

    console.log("✅ Private Key válida");
    console.log("📍 Dirección Ethereum/Polygon:", address);
    console.log("");

    // Conectar a Polygon y verificar balance
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const balance = await provider.getBalance(address);
    const balanceInMatic = ethers.formatEther(balance);

    console.log("💰 Balance en Polygon Mainnet:", balanceInMatic, "MATIC");
    console.log("");

    const balanceNum = parseFloat(balanceInMatic);
    if (balanceNum === 0) {
      console.log("⚠️ La wallet no tiene MATIC");
      console.log("   Necesitas enviar MATIC a esta dirección:", address);
    } else if (balanceNum < 1) {
      console.log("⚠️ Balance bajo (< 1 MATIC)");
      console.log("   Puede no ser suficiente para el despliegue");
    } else {
      console.log("✅ Balance suficiente para despliegue");
    }

    console.log("\n🔗 Ver en PolygonScan:");
    console.log(`   https://polygonscan.com/address/${address}`);

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main();

