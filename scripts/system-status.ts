import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

/**
 * Script para mostrar el estado completo del sistema
 * Incluye información del contrato, deployments, y configuración
 * 
 * Uso: tsx scripts/system-status.ts
 */

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x1D645cd86Ad6920132f5fa1081C20A677B854F3D";
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || "https://polygon-rpc.com";

interface SystemInfo {
  contract: {
    address: string;
    deployed: boolean;
    owner?: string;
    network?: string;
  };
  deployments: {
    exists: boolean;
    path?: string;
    data?: any;
  };
  builds: {
    backend: boolean;
    agent: boolean;
    frontend: boolean;
  };
  environment: {
    rpcUrl: string;
    contractAddress: string;
    hasPrivateKey: boolean;
    hasOpenAIKey: boolean;
  };
}

async function getContractInfo(): Promise<SystemInfo["contract"]> {
  try {
    const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
    const code = await provider.getCode(CONTRACT_ADDRESS);
    
    if (code === "0x") {
      return {
        address: CONTRACT_ADDRESS,
        deployed: false
      };
    }

    const abi = ["function owner() view returns (address)"];
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    const owner = await contract.owner();
    const network = await provider.getNetwork();

    return {
      address: CONTRACT_ADDRESS,
      deployed: true,
      owner: owner,
      network: `Polygon Mainnet (Chain ID: ${network.chainId})`
    };
  } catch (error: any) {
    return {
      address: CONTRACT_ADDRESS,
      deployed: false
    };
  }
}

function getDeploymentInfo(): SystemInfo["deployments"] {
  const deploymentPath = path.join(__dirname, "../deployments/polygon-mainnet.json");
  
  if (!fs.existsSync(deploymentPath)) {
    return { exists: false };
  }

  try {
    const data = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
    return {
      exists: true,
      path: deploymentPath,
      data
    };
  } catch {
    return { exists: true, path: deploymentPath };
  }
}

function getBuildInfo(): SystemInfo["builds"] {
  return {
    backend: fs.existsSync(path.join(__dirname, "../backend/dist/index.js")),
    agent: fs.existsSync(path.join(__dirname, "../agent/dist/index.js")),
    frontend: fs.existsSync(path.join(__dirname, "../build/index.html"))
  };
}

function getEnvironmentInfo(): SystemInfo["environment"] {
  return {
    rpcUrl: POLYGON_RPC_URL,
    contractAddress: CONTRACT_ADDRESS,
    hasPrivateKey: !!process.env.PRIVATE_KEY,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY
  };
}

function printSection(title: string, content: string) {
  console.log(`\n${title}`);
  console.log("=".repeat(50));
  console.log(content);
}

async function main() {
  console.log("📊 System Status - Agentic Agricultural Validation System");
  console.log("=".repeat(60));

  const contractInfo = await getContractInfo();
  const deploymentInfo = getDeploymentInfo();
  const buildInfo = getBuildInfo();
  const envInfo = getEnvironmentInfo();

  // Contract Info
  printSection("📋 Smart Contract", `
Address: ${contractInfo.address}
Deployed: ${contractInfo.deployed ? "✅ Yes" : "❌ No"}
${contractInfo.owner ? `Owner: ${contractInfo.owner}` : ""}
${contractInfo.network ? `Network: ${contractInfo.network}` : ""}
PolygonScan: https://polygonscan.com/address/${contractInfo.address}
  `.trim());

  // Deployment Info
  printSection("🚀 Deployment Info", `
Deployment File: ${deploymentInfo.exists ? "✅ Exists" : "❌ Not found"}
${deploymentInfo.path ? `Path: ${deploymentInfo.path}` : ""}
${deploymentInfo.data ? `Deployed At: ${deploymentInfo.data.deployedAt || "N/A"}` : ""}
  `.trim());

  // Build Status
  printSection("🔨 Build Status", `
Backend: ${buildInfo.backend ? "✅ Built" : "❌ Not built"}
Agent: ${buildInfo.agent ? "✅ Built" : "❌ Not built"}
Frontend: ${buildInfo.frontend ? "✅ Built" : "❌ Not built"}
  `.trim());

  // Environment
  printSection("⚙️  Environment", `
RPC URL: ${envInfo.rpcUrl}
Contract Address: ${envInfo.contractAddress}
Private Key: ${envInfo.hasPrivateKey ? "✅ Set" : "⚠️  Not set"}
OpenAI API Key: ${envInfo.hasOpenAIKey ? "✅ Set" : "⚠️  Not set"}
  `.trim());

  // Quick Links
  printSection("🔗 Quick Links", `
Contract: https://polygonscan.com/address/${CONTRACT_ADDRESS}
Backend API: http://localhost:3001
Frontend: http://localhost:3000
Health Check: tsx scripts/health-check.ts
  `.trim());

  // Recommendations
  const recommendations: string[] = [];
  
  if (!contractInfo.deployed) {
    recommendations.push("Deploy the smart contract: ./scripts/deploy-all.sh");
  }
  
  if (!buildInfo.backend) {
    recommendations.push("Build backend: cd backend && npm run build");
  }
  
  if (!buildInfo.agent) {
    recommendations.push("Build agent: cd agent && npm run build");
  }
  
  if (!buildInfo.frontend) {
    recommendations.push("Build frontend: npm run build");
  }
  
  if (!envInfo.hasPrivateKey) {
    recommendations.push("Set PRIVATE_KEY in .env for write operations");
  }

  if (recommendations.length > 0) {
    printSection("💡 Recommendations", recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n"));
  } else {
    printSection("✅ Status", "All systems ready!");
  }

  console.log("\n" + "=".repeat(60));
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
