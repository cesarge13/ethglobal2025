import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { ethers } from "hardhat";

dotenv.config();

async function main() {
  const CONTRACT_ADDRESS = "0x1D645cd86Ad6920132f5fa1081C20A677B854F3D";
  const API_KEY = process.env.POLYGONSCAN_API_KEY;

  if (!API_KEY) {
    throw new Error("POLYGONSCAN_API_KEY no configurada");
  }

  console.log("🔍 Verificando contrato manualmente...");
  console.log("📍 Contrato:", CONTRACT_ADDRESS);
  console.log("🔑 API Key:", API_KEY.substring(0, 10) + "...");

  // Leer el código fuente del contrato
  const contractPath = path.join(__dirname, "../contracts/AgriculturalReputation.sol");
  const sourceCode = fs.readFileSync(contractPath, "utf-8");

  // Leer el ABI compilado
  const artifactPath = path.join(__dirname, "../artifacts/contracts/AgriculturalReputation.sol/AgriculturalReputation.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  // Obtener el bytecode
  const bytecode = artifact.bytecode;

  // Configuración del compilador
  const compilerVersion = "v0.8.20+commit.a1b79de6";
  const optimizationEnabled = "1";
  const optimizationRuns = "200";

  // Construir los datos para la verificación
  const verificationData = {
    apikey: API_KEY,
    module: "contract",
    action: "verifysourcecode",
    contractaddress: CONTRACT_ADDRESS,
    sourceCode: sourceCode,
    codeformat: "solidity-single-file",
    contractname: "AgriculturalReputation",
    compilerversion: compilerVersion,
    optimizationUsed: optimizationEnabled,
    runs: optimizationRuns,
    licenseType: "3", // MIT License
  };

  console.log("\n📤 Enviando solicitud de verificación a PolygonScan...");

  try {
    const response = await fetch("https://api.polygonscan.com/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(verificationData as any).toString(),
    });

    const result = await response.json();

    if (result.status === "1" && result.result) {
      console.log("✅ Verificación enviada exitosamente!");
      console.log("📋 GUID:", result.result);
      console.log("\n⏳ Espera unos minutos y verifica en:");
      console.log(`   https://polygonscan.com/address/${CONTRACT_ADDRESS}`);
      console.log("\n💡 Puedes verificar el estado con:");
      console.log(`   curl "https://api.polygonscan.com/api?module=contract&action=checkverifystatus&apikey=${API_KEY}&guid=${result.result}"`);
    } else {
      console.error("❌ Error en la verificación:");
      console.error(result);
    }
  } catch (error: any) {
    console.error("❌ Error al enviar verificación:", error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

