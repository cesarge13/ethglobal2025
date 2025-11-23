#!/usr/bin/env node

import { AgriculturalValidationAgent } from './agent';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * CLI para ejecutar el agente desde línea de comandos
 */

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log('🤖 Agente IA de Validación Agrícola - CLI');
    console.log('');
    console.log('Uso:');
    console.log('  npm run agent validate <farmerAddress> <documents...>');
    console.log('  npm run agent report <farmerAddress>');
    console.log('');
    console.log('Ejemplos:');
    console.log('  npm run agent validate 0x... identity.pdf cert1.pdf cert2.pdf');
    console.log('  npm run agent report 0x...');
    process.exit(0);
  }

  const agent = new AgriculturalValidationAgent();

  try {
    switch (command) {
      case 'validate':
        await handleValidate(agent, args.slice(1));
        break;
      
      case 'report':
        await handleReport(agent, args.slice(1));
        break;
      
      default:
        console.error(`❌ Comando desconocido: ${command}`);
        process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function handleValidate(agent: AgriculturalValidationAgent, args: string[]) {
  if (args.length < 1) {
    console.error('❌ Uso: validate <farmerAddress> [documents...]');
    process.exit(1);
  }

  const farmerAddress = args[0];
  const documentPaths = args.slice(1);

  if (documentPaths.length === 0) {
    console.error('❌ Debes proporcionar al menos un documento');
    process.exit(1);
  }

  // Verificar que los archivos existan
  for (const docPath of documentPaths) {
    if (!fs.existsSync(docPath)) {
      console.error(`❌ Archivo no encontrado: ${docPath}`);
      process.exit(1);
    }
  }

  console.log(`🔍 Validando documentos para agricultor: ${farmerAddress}`);
  console.log(`📄 Documentos: ${documentPaths.length}`);

  const result = await agent.processDocuments(farmerAddress, documentPaths);

  console.log('');
  console.log('📊 Resultados:');
  console.log(`   ✅ Documentos procesados: ${result.results.length}`);
  console.log(`   💰 Micropagos ejecutados: ${result.totalPayments}`);
  console.log(`   💵 Total pagado: ${result.totalAmount} MATIC`);
  console.log('');

  result.results.forEach((r, i) => {
    console.log(`   ${i + 1}. ${path.basename(r.documentPath)}`);
    console.log(`      Tipo: ${r.docType}`);
    console.log(`      Válido: ${r.isValid ? '✅' : '❌'}`);
    console.log(`      Confianza: ${r.confidence}%`);
    if (r.txHash) {
      console.log(`      TX: https://polygonscan.com/tx/${r.txHash}`);
    }
    if (r.paymentHash) {
      console.log(`      Pago: https://polygonscan.com/tx/${r.paymentHash}`);
    }
    if (r.error) {
      console.log(`      Error: ${r.error}`);
    }
    console.log('');
  });
}

async function handleReport(agent: AgriculturalValidationAgent, args: string[]) {
  if (args.length < 1) {
    console.error('❌ Uso: report <farmerAddress>');
    process.exit(1);
  }

  const farmerAddress = args[0];

  console.log(`📊 Generando informe para agricultor: ${farmerAddress}`);

  const report = await agent.generateReport(farmerAddress);

  console.log('');
  console.log('📋 Informe de Confianza Agrícola');
  console.log(`   Agricultor: ${report.farmerAddress}`);
  console.log(`   Score de Reputación: ${report.reputationScore}/100`);
  console.log(`   Verificaciones Totales: ${report.totalVerifications}`);
  console.log(`   Certificaciones Válidas: ${report.validCertifications}`);
  console.log('');
  console.log('📝 Pasos de Verificación:');
  report.verificationSteps.forEach(step => {
    console.log(`   ${step.step}. ${step.details}: ${step.status ? '✅' : '❌'}`);
  });
  console.log('');

  if (report.paymentHash) {
    console.log(`💵 Micropago ejecutado: https://polygonscan.com/tx/${report.paymentHash}`);
  }
}

main();

