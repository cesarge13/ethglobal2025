import * as http from "http";

/**
 * Script para probar los endpoints del backend
 * 
 * Uso: tsx scripts/test-backend.ts
 */
const BASE_URL = process.env.BACKEND_URL || "http://localhost:3001";

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  response?: any;
}

async function httpRequest(
  method: string,
  path: string,
  data?: any
): Promise<{ statusCode?: number; body: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options: http.RequestOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(url, options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body });
        }
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testEndpoint(
  name: string,
  method: string,
  path: string,
  data?: any
): Promise<TestResult> {
  try {
    const result = await httpRequest(method, path, data);
    const passed = result.statusCode && result.statusCode < 500;
    return {
      name,
      passed,
      response: result.body,
      error: passed ? undefined : `Status: ${result.statusCode}`,
    };
  } catch (error: any) {
    return {
      name,
      passed: false,
      error: error.message,
    };
  }
}

async function main() {
  console.log("🧪 Testing Backend API");
  console.log("=====================\n");
  console.log("Base URL:", BASE_URL);
  console.log("");

  const tests: Array<Promise<TestResult>> = [];

  // Test 1: Health Check
  tests.push(testEndpoint("Health Check", "GET", "/health"));

  // Test 2: API Info
  tests.push(testEndpoint("API Info", "GET", "/"));

  // Test 3: Get User Status (con dirección de prueba)
  const testAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
  tests.push(testEndpoint("Get User Status", "GET", `/api/get-user-status/${testAddress}`));

  // Test 4: x402 Rates
  tests.push(testEndpoint("Get x402 Rates", "GET", "/api/x402-rates"));

  // Test 5: LLM Wallet List
  tests.push(testEndpoint("List LLM Wallets", "GET", "/api/llm-wallet/list"));

  // Test 6: AutoPay Rules
  tests.push(testEndpoint("Get AutoPay Rules", "GET", "/api/autopay/rules"));

  // Ejecutar tests
  const results = await Promise.all(tests);

  // Mostrar resultados
  let passed = 0;
  let failed = 0;

  for (const result of results) {
    if (result.passed) {
      console.log(`✅ ${result.name}`);
      passed++;
    } else {
      console.log(`❌ ${result.name}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      failed++;
    }
  }

  console.log("");
  console.log("=====================");
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${results.length}`);

  if (failed > 0) {
    console.log("\n⚠️  Some tests failed. Make sure the backend is running:");
    console.log("   cd backend && npm run dev");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

