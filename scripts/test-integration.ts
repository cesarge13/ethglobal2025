import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as https from "https";
import * as http from "http";

dotenv.config();

/**
 * Script de integración completo que prueba el flujo end-to-end
 * 
 * Uso: tsx scripts/test-integration.ts
 */

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x1D645cd86Ad6920132f5fa1081C20A677B854F3D";
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || "https://polygon-rpc.com";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

async function httpRequest(url: string, options: any = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === "https:" ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve({ statusCode: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ statusCode: res.statusCode, data });
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function testContractConnection(): Promise<TestResult> {
  try {
    const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
    const code = await provider.getCode(CONTRACT_ADDRESS);
    
    if (code === "0x") {
      return {
        name: "Contract Connection",
        passed: false,
        message: "Contract not deployed"
      };
    }

    const abi = ["function owner() view returns (address)"];
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    const owner = await contract.owner();

    return {
      name: "Contract Connection",
      passed: true,
      message: "Contract is accessible",
      details: { owner }
    };
  } catch (error: any) {
    return {
      name: "Contract Connection",
      passed: false,
      message: error.message
    };
  }
}

async function testBackendHealth(): Promise<TestResult> {
  try {
    const response = await httpRequest(`${BACKEND_URL}/health`);
    return {
      name: "Backend Health",
      passed: response.statusCode === 200,
      message: response.statusCode === 200 ? "Backend is healthy" : `Status: ${response.statusCode}`,
      details: response.data
    };
  } catch (error: any) {
    return {
      name: "Backend Health",
      passed: false,
      message: error.message
    };
  }
}

async function testBackendEndpoints(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  // Test x402 rates
  try {
    const response = await httpRequest(`${BACKEND_URL}/api/x402-rates`);
    results.push({
      name: "x402 Rates Endpoint",
      passed: response.statusCode === 200,
      message: response.statusCode === 200 ? "Endpoint working" : `Status: ${response.statusCode}`
    });
  } catch (error: any) {
    results.push({
      name: "x402 Rates Endpoint",
      passed: false,
      message: error.message
    });
  }

  // Test user status
  try {
    const testAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
    const response = await httpRequest(`${BACKEND_URL}/api/get-user-status/${testAddress}`);
    results.push({
      name: "User Status Endpoint",
      passed: response.statusCode === 200,
      message: response.statusCode === 200 ? "Endpoint working" : `Status: ${response.statusCode}`,
      details: response.data
    });
  } catch (error: any) {
    results.push({
      name: "User Status Endpoint",
      passed: false,
      message: error.message
    });
  }

  return results;
}

async function testContractReadFunctions(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  try {
    const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
    const abi = [
      "function owner() view returns (address)",
      "function getFarmerInfo(address) view returns (uint256, uint256, uint256, bool)"
    ];
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    
    // Test owner function
    try {
      const owner = await contract.owner();
      results.push({
        name: "Contract: owner()",
        passed: true,
        message: "Function call successful",
        details: { owner }
      });
    } catch (error: any) {
      results.push({
        name: "Contract: owner()",
        passed: false,
        message: error.message
      });
    }

    // Test getFarmerInfo (may fail if farmer not registered)
    try {
      const testAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
      const info = await contract.getFarmerInfo(testAddress);
      results.push({
        name: "Contract: getFarmerInfo()",
        passed: true,
        message: "Function call successful",
        details: { info: info.toString() }
      });
    } catch (error: any) {
      results.push({
        name: "Contract: getFarmerInfo()",
        passed: false,
        message: error.message
      });
    }
  } catch (error: any) {
    results.push({
      name: "Contract Read Functions",
      passed: false,
      message: `Setup error: ${error.message}`
    });
  }

  return results;
}

async function main() {
  console.log("🧪 Integration Test - Agentic Agricultural Validation System");
  console.log("=".repeat(60));
  console.log();

  const allResults: TestResult[] = [];

  // Test 1: Contract Connection
  console.log("📋 Testing Contract Connection...");
  const contractTest = await testContractConnection();
  allResults.push(contractTest);
  console.log(`${contractTest.passed ? "✅" : "❌"} ${contractTest.name}: ${contractTest.message}`);
  console.log();

  // Test 2: Backend Health
  console.log("📋 Testing Backend Health...");
  const backendTest = await testBackendHealth();
  allResults.push(backendTest);
  console.log(`${backendTest.passed ? "✅" : "❌"} ${backendTest.name}: ${backendTest.message}`);
  console.log();

  // Test 3: Backend Endpoints
  if (backendTest.passed) {
    console.log("📋 Testing Backend Endpoints...");
    const endpointTests = await testBackendEndpoints();
    allResults.push(...endpointTests);
    endpointTests.forEach(test => {
      console.log(`${test.passed ? "✅" : "❌"} ${test.name}: ${test.message}`);
    });
    console.log();
  }

  // Test 4: Contract Read Functions
  if (contractTest.passed) {
    console.log("📋 Testing Contract Read Functions...");
    const contractTests = await testContractReadFunctions();
    allResults.push(...contractTests);
    contractTests.forEach(test => {
      console.log(`${test.passed ? "✅" : "❌"} ${test.name}: ${test.message}`);
    });
    console.log();
  }

  // Summary
  const passed = allResults.filter(r => r.passed).length;
  const failed = allResults.filter(r => !r.passed).length;

  console.log("=".repeat(60));
  console.log("📊 Test Summary");
  console.log("=".repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${allResults.length}`);
  console.log();

  if (failed > 0) {
    console.log("❌ Failed Tests:");
    allResults.filter(r => !r.passed).forEach(test => {
      console.log(`   - ${test.name}: ${test.message}`);
    });
    console.log();
    process.exit(1);
  } else {
    console.log("🎉 All integration tests passed!");
    process.exit(0);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
