import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as https from "https";
import * as http from "http";

dotenv.config();

/**
 * Health Check completo para todos los servicios del sistema
 * 
 * Uso: tsx scripts/health-check.ts
 */

interface HealthStatus {
  service: string;
  status: "healthy" | "unhealthy" | "unknown";
  message: string;
  details?: any;
}

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x1D645cd86Ad6920132f5fa1081C20A677B854F3D";
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || "https://polygon-rpc.com";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

async function checkContract(): Promise<HealthStatus> {
  try {
    const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
    const code = await provider.getCode(CONTRACT_ADDRESS);
    
    if (code === "0x") {
      return {
        service: "Smart Contract",
        status: "unhealthy",
        message: "Contract not deployed at address",
        details: { address: CONTRACT_ADDRESS }
      };
    }

    // Try to call a view function
    const abi = [
      "function owner() view returns (address)",
      "function getFarmerInfo(address) view returns (uint256, uint256, uint256, bool)"
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    const owner = await contract.owner();
    
    return {
      service: "Smart Contract",
      status: "healthy",
      message: "Contract is deployed and accessible",
      details: {
        address: CONTRACT_ADDRESS,
        owner: owner,
        network: "Polygon Mainnet"
      }
    };
  } catch (error: any) {
    return {
      service: "Smart Contract",
      status: "unhealthy",
      message: `Error checking contract: ${error.message}`,
      details: { error: error.message }
    };
  }
}

async function checkRPC(): Promise<HealthStatus> {
  try {
    const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
    const blockNumber = await provider.getBlockNumber();
    const network = await provider.getNetwork();
    
    return {
      service: "Polygon RPC",
      status: "healthy",
      message: "RPC connection successful",
      details: {
        blockNumber,
        chainId: Number(network.chainId),
        rpcUrl: POLYGON_RPC_URL
      }
    };
  } catch (error: any) {
    return {
      service: "Polygon RPC",
      status: "unhealthy",
      message: `RPC connection failed: ${error.message}`,
      details: { error: error.message }
    };
  }
}

async function checkBackend(): Promise<HealthStatus> {
  return new Promise((resolve) => {
    const url = new URL(`${BACKEND_URL}/health`);
    const client = url.protocol === "https:" ? https : http;
    
    const req = client.get(url.toString(), (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve({
            service: "Backend API",
            status: res.statusCode === 200 ? "healthy" : "unhealthy",
            message: res.statusCode === 200 ? "Backend is running" : `Backend returned status ${res.statusCode}`,
            details: json
          });
        } catch {
          resolve({
            service: "Backend API",
            status: res.statusCode === 200 ? "healthy" : "unhealthy",
            message: `Backend responded with status ${res.statusCode}`,
            details: { statusCode: res.statusCode }
          });
        }
      });
    });

    req.on("error", (error) => {
      resolve({
        service: "Backend API",
        status: "unhealthy",
        message: `Backend not reachable: ${error.message}`,
        details: { error: error.message, url: BACKEND_URL }
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        service: "Backend API",
        status: "unhealthy",
        message: "Backend request timeout",
        details: { url: BACKEND_URL }
      });
    });
  });
}

async function checkBackendEndpoints(): Promise<HealthStatus> {
  const endpoints = [
    "/api/x402-rates",
    "/api/get-user-status/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  ];

  const results: any[] = [];
  let healthy = 0;
  let unhealthy = 0;

  for (const endpoint of endpoints) {
    try {
      const url = new URL(`${BACKEND_URL}${endpoint}`);
      const client = url.protocol === "https:" ? https : http;
      
      await new Promise<void>((resolve, reject) => {
        const req = client.get(url.toString(), (res) => {
          results.push({
            endpoint,
            status: res.statusCode,
            ok: res.statusCode && res.statusCode < 400
          });
          if (res.statusCode && res.statusCode < 400) {
            healthy++;
          } else {
            unhealthy++;
          }
          resolve();
        });
        req.on("error", () => {
          results.push({ endpoint, status: "error", ok: false });
          unhealthy++;
          resolve();
        });
        req.setTimeout(3000, () => {
          req.destroy();
          results.push({ endpoint, status: "timeout", ok: false });
          unhealthy++;
          resolve();
        });
      });
    } catch {
      results.push({ endpoint, status: "error", ok: false });
      unhealthy++;
    }
  }

  return {
    service: "Backend Endpoints",
    status: unhealthy === 0 ? "healthy" : unhealthy === results.length ? "unhealthy" : "unknown",
    message: `${healthy} healthy, ${unhealthy} unhealthy endpoints`,
    details: { results }
  };
}

async function checkEnvironment(): Promise<HealthStatus> {
  const required = [
    "POLYGON_RPC_URL",
    "CONTRACT_ADDRESS"
  ];

  const optional = [
    "PRIVATE_KEY",
    "OPENAI_API_KEY",
    "POLYGONSCAN_API_KEY"
  ];

  const missing = required.filter(key => !process.env[key]);
  const presentOptional = optional.filter(key => process.env[key]);

  return {
    service: "Environment Variables",
    status: missing.length === 0 ? "healthy" : "unhealthy",
    message: missing.length === 0 
      ? "All required variables present" 
      : `Missing required variables: ${missing.join(", ")}`,
    details: {
      required: {
        present: required.length - missing.length,
        missing,
        total: required.length
      },
      optional: {
        present: presentOptional.length,
        total: optional.length
      }
    }
  };
}

async function main() {
  console.log("🏥 Health Check - Agentic Agricultural Validation System");
  console.log("=======================================================\n");

  const checks: Promise<HealthStatus>[] = [
    checkEnvironment(),
    checkRPC(),
    checkContract(),
    checkBackend(),
    checkBackendEndpoints()
  ];

  const results = await Promise.all(checks);

  console.log("Results:\n");
  
  let healthyCount = 0;
  let unhealthyCount = 0;
  let unknownCount = 0;

  for (const result of results) {
    const icon = result.status === "healthy" ? "✅" : result.status === "unhealthy" ? "❌" : "⚠️";
    console.log(`${icon} ${result.service}: ${result.message}`);
    
    if (result.details) {
      console.log(`   Details:`, JSON.stringify(result.details, null, 2).split("\n").join("\n   "));
    }
    console.log();

    if (result.status === "healthy") healthyCount++;
    else if (result.status === "unhealthy") unhealthyCount++;
    else unknownCount++;
  }

  console.log("=======================================================");
  console.log(`✅ Healthy: ${healthyCount}`);
  console.log(`❌ Unhealthy: ${unhealthyCount}`);
  console.log(`⚠️  Unknown: ${unknownCount}`);
  console.log(`📊 Total: ${results.length}`);

  if (unhealthyCount > 0) {
    console.log("\n⚠️  Some services are unhealthy. Please review the errors above.");
    process.exit(1);
  } else {
    console.log("\n🎉 All services are healthy!");
    process.exit(0);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
