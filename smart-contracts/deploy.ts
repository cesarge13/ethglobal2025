import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

/**
 * Script para desplegar el contrato AgriculturalReputation en Polygon Mainnet
 */
async function main() {
  console.log("🚀 Iniciando despliegue en Polygon Mainnet...");
  
  // Verificar configuración
  if (!process.env.PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY no configurada en .env");
  }
  
  if (!process.env.POLYGON_RPC_URL) {
    throw new Error("❌ POLYGON_RPC_URL no configurada en .env");
  }
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Desplegando con la cuenta:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance de cuenta:", ethers.formatEther(balance), "MATIC");
  
  if (balance === 0n) {
    throw new Error("❌ La cuenta no tiene MATIC. Necesitas fondos para gas.");
  }
  
  // Desplegar contrato
  console.log("📦 Desplegando contrato AgriculturalReputation...");
  const AgriculturalReputation = await ethers.getContractFactory("AgriculturalReputation");
  const contract = await AgriculturalReputation.deploy();
  
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  
  console.log("✅ Contrato desplegado exitosamente!");
  console.log("📍 Dirección del contrato:", contractAddress);
  console.log("🔗 Ver en PolygonScan: https://polygonscan.com/address/" + contractAddress);
  
  // Guardar información del despliegue
  const deploymentInfo = {
    network: "polygon-mainnet",
    chainId: 137,
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    transactionHash: contract.deploymentTransaction()?.hash,
  };
  
  const deploymentPath = path.join(__dirname, "../deployments", "polygon-mainnet.json");
  const deploymentDir = path.dirname(deploymentPath);
  
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Información de despliegue guardada en:", deploymentPath);
  
  // Verificar el contrato (opcional, requiere API key de PolygonScan)
  if (process.env.POLYGONSCAN_API_KEY) {
    console.log("🔍 Verificando contrato en PolygonScan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contrato verificado en PolygonScan");
    } catch (error) {
      console.log("⚠️ Error al verificar contrato:", error);
    }
  } else {
    console.log("⚠️ POLYGONSCAN_API_KEY no configurada. Omitiendo verificación.");
  }
  
  console.log("\n🎉 Despliegue completado!");
  console.log("\n📋 Próximos pasos:");
  console.log("1. Guarda la dirección del contrato en tu archivo .env del backend");
  console.log("2. Configura el backend para usar esta dirección");
  console.log("3. Reinicia el backend");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

