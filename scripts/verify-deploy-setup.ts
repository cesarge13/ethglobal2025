import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../smart-contracts/.env") });

/**
 * Script para verificar la configuración antes del despliegue
 */
async function main() {
  console.log("🔍 Verificando configuración para despliegue...\n");

  let errors: string[] = [];
  let warnings: string[] = [];

  // 1. Verificar archivo .env
  const envPath = path.join(__dirname, "../smart-contracts/.env");
  if (!fs.existsSync(envPath)) {
    errors.push("❌ Archivo .env no encontrado en smart-contracts/");
    errors.push("   Crea el archivo: cp smart-contracts/.env.template smart-contracts/.env");
  } else {
    console.log("✅ Archivo .env encontrado");
  }

  // 2. Verificar PRIVATE_KEY
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    errors.push("❌ PRIVATE_KEY no configurada en .env");
  } else {
    // Verificar formato
    if (privateKey.startsWith("0x")) {
      warnings.push("⚠️ PRIVATE_KEY tiene prefijo 0x. Debería estar sin prefijo.");
    }
    if (privateKey.length !== 64) {
      errors.push("❌ PRIVATE_KEY tiene longitud incorrecta (debe ser 64 caracteres sin 0x)");
    } else {
      console.log("✅ PRIVATE_KEY configurada");
    }
  }

  // 3. Verificar POLYGON_RPC_URL
  const rpcUrl = process.env.POLYGON_RPC_URL;
  if (!rpcUrl) {
    errors.push("❌ POLYGON_RPC_URL no configurada en .env");
  } else {
    console.log("✅ POLYGON_RPC_URL configurada:", rpcUrl);
  }

  // 4. Verificar balance de MATIC
  if (privateKey && rpcUrl) {
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const wallet = new ethers.Wallet(privateKey, provider);
      const address = wallet.address;
      const balance = await provider.getBalance(address);
      const balanceInMatic = ethers.formatEther(balance);

      console.log("\n💰 Información de Wallet:");
      console.log("   Dirección:", address);
      console.log("   Balance:", balanceInMatic, "MATIC");

      const balanceNum = parseFloat(balanceInMatic);
      if (balanceNum === 0) {
        errors.push("❌ La wallet no tiene MATIC. Necesitas fondos para gas.");
      } else if (balanceNum < 1) {
        warnings.push("⚠️ Balance bajo (< 1 MATIC). Puede no ser suficiente para el despliegue.");
      } else {
        console.log("✅ Balance suficiente para despliegue");
      }
    } catch (error: any) {
      errors.push(`❌ Error al conectar con Polygon RPC: ${error.message}`);
    }
  }

  // 5. Verificar POLYGONSCAN_API_KEY (opcional)
  if (!process.env.POLYGONSCAN_API_KEY) {
    warnings.push("⚠️ POLYGONSCAN_API_KEY no configurada (opcional, para verificar contrato)");
  } else {
    console.log("✅ POLYGONSCAN_API_KEY configurada");
  }

  // 6. Verificar que el contrato está compilado
  const artifactsPath = path.join(__dirname, "../smart-contracts/artifacts/contracts/AgriculturalReputation.sol/AgriculturalReputation.json");
  if (!fs.existsSync(artifactsPath)) {
    errors.push("❌ Contrato no compilado. Ejecuta: cd smart-contracts && npm run compile");
  } else {
    console.log("✅ Contrato compilado");
  }

  // Resumen
  console.log("\n" + "=".repeat(50));
  if (errors.length > 0) {
    console.log("❌ ERRORES ENCONTRADOS:");
    errors.forEach((error) => console.log("   " + error));
    console.log("\n⚠️ Corrige los errores antes de desplegar.");
    process.exit(1);
  } else {
    console.log("✅ CONFIGURACIÓN CORRECTA");
    if (warnings.length > 0) {
      console.log("\n⚠️ ADVERTENCIAS:");
      warnings.forEach((warning) => console.log("   " + warning));
    }
    console.log("\n🚀 Listo para desplegar!");
    console.log("   Ejecuta: cd smart-contracts && npm run deploy:polygon");
    process.exit(0);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

