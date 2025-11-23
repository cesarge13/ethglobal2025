import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

/**
 * Script para probar el contrato desplegado en Polygon Mainnet
 * 
 * Uso: tsx scripts/test-contract.ts
 */
async function main() {
  console.log("🧪 Testing AgriculturalReputation Contract");
  console.log("==========================================\n");

  // Verificar configuración
  if (!process.env.POLYGON_RPC_URL) {
    throw new Error("❌ POLYGON_RPC_URL no configurada en .env");
  }

  if (!process.env.CONTRACT_ADDRESS) {
    throw new Error("❌ CONTRACT_ADDRESS no configurada en .env");
  }

  const contractAddress = process.env.CONTRACT_ADDRESS;
  const rpcUrl = process.env.POLYGON_RPC_URL;

  console.log("📍 Contract Address:", contractAddress);
  console.log("🌐 RPC URL:", rpcUrl);
  console.log("");

  // Conectar al provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const network = await provider.getNetwork();
  console.log("🔗 Network:", network.name, "(Chain ID:", network.chainId.toString() + ")");
  console.log("");

  // Cargar ABI
  const abiPath = path.join(__dirname, "../backend/src/contracts/AgriculturalReputation.json");
  if (!fs.existsSync(abiPath)) {
    throw new Error(`❌ ABI no encontrado en: ${abiPath}`);
  }

  const contractJson = JSON.parse(fs.readFileSync(abiPath, "utf-8"));
  const abi = contractJson.abi;

  // Crear instancia del contrato
  const contract = new ethers.Contract(contractAddress, abi, provider);

  // Tests
  const tests: Array<{ name: string; fn: () => Promise<any> }> = [];

  // Test 1: Obtener owner
  tests.push({
    name: "Get Owner",
    fn: async () => {
      const owner = await contract.owner();
      return { owner };
    },
  });

  // Test 2: Verificar que el contrato está desplegado
  tests.push({
    name: "Check Contract Code",
    fn: async () => {
      const code = await provider.getCode(contractAddress);
      if (code === "0x") {
        throw new Error("Contract not deployed at this address");
      }
      return { codeLength: code.length };
    },
  });

  // Test 3: Obtener información de un agricultor (si existe)
  if (process.env.TEST_FARMER_ADDRESS) {
    tests.push({
      name: "Get Farmer Info",
      fn: async () => {
        try {
          const farmerInfo = await contract.getFarmerInfo(process.env.TEST_FARMER_ADDRESS!);
          return {
            address: process.env.TEST_FARMER_ADDRESS,
            isRegistered: farmerInfo.isRegistered,
            reputation: farmerInfo.reputation.toString(),
            verificationCount: farmerInfo.verificationCount.toString(),
          };
        } catch (error: any) {
          return { error: error.message };
        }
      },
    });
  }

  // Ejecutar tests
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`📋 Testing: ${test.name}...`);
      const result = await test.fn();
      console.log("✅ PASSED");
      console.log("   Result:", JSON.stringify(result, null, 2));
      passed++;
    } catch (error: any) {
      console.log("❌ FAILED");
      console.log("   Error:", error.message);
      failed++;
    }
    console.log("");
  }

  // Resumen
  console.log("==========================================");
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${tests.length}`);

  if (failed > 0) {
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

