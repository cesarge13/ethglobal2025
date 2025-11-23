import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

/**
 * Script para verificar que el deployment está completo y correcto
 * 
 * Uso: tsx scripts/verify-deployment.ts
 */
async function main() {
  console.log("🔍 Verifying Deployment");
  console.log("=======================\n");

  const checks: Array<{ name: string; check: () => Promise<boolean>; message?: string }> = [];

  // Check 1: Variables de entorno
  checks.push({
    name: "Environment Variables",
    check: async () => {
      const required = [
        "POLYGON_RPC_URL",
        "CONTRACT_ADDRESS",
      ];
      
      const missing = required.filter(key => !process.env[key]);
      if (missing.length > 0) {
        console.log(`   Missing: ${missing.join(", ")}`);
        return false;
      }
      return true;
    },
  });

  // Check 2: Contrato desplegado
  checks.push({
    name: "Contract Deployment",
    check: async () => {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
        const code = await provider.getCode(process.env.CONTRACT_ADDRESS!);
        return code !== "0x";
      } catch (error) {
        return false;
      }
    },
  });

  // Check 3: ABI existe
  checks.push({
    name: "Contract ABI",
    check: async () => {
      const abiPath = path.join(__dirname, "../backend/src/contracts/AgriculturalReputation.json");
      return fs.existsSync(abiPath);
    },
  });

  // Check 4: Deployment info existe
  checks.push({
    name: "Deployment Info",
    check: async () => {
      const deploymentPath = path.join(__dirname, "../deployments/polygon-mainnet.json");
      return fs.existsSync(deploymentPath);
    },
  });

  // Check 5: Backend compilado
  checks.push({
    name: "Backend Build",
    check: async () => {
      const distPath = path.join(__dirname, "../backend/dist/index.js");
      return fs.existsSync(distPath);
    },
  });

  // Check 6: Agent compilado
  checks.push({
    name: "Agent Build",
    check: async () => {
      const distPath = path.join(__dirname, "../agent/dist/index.js");
      return fs.existsSync(distPath);
    },
  });

  // Ejecutar checks
  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    console.log(`📋 Checking: ${check.name}...`);
    try {
      const result = await check.check();
      if (result) {
        console.log("✅ PASSED");
        passed++;
      } else {
        console.log("❌ FAILED");
        if (check.message) {
          console.log(`   ${check.message}`);
        }
        failed++;
      }
    } catch (error: any) {
      console.log("❌ FAILED");
      console.log(`   Error: ${error.message}`);
      failed++;
    }
    console.log("");
  }

  // Resumen
  console.log("=======================");
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${checks.length}`);

  if (failed > 0) {
    console.log("\n⚠️  Some checks failed. Please review the errors above.");
    process.exit(1);
  } else {
    console.log("\n🎉 All checks passed! Deployment is ready.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

