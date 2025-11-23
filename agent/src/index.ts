import { AgriculturalValidationAgent } from './agent';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Agente IA para Validación Agrícola
 * 
 * Este agente:
 * 1. Procesa documentos agrícolas (PDF, imágenes)
 * 2. Valida identidad, certificaciones, almacenes, cultivos usando LLM
 * 3. Ejecuta micropagos x402 por cada acción
 * 4. Actualiza reputación on-chain
 * 5. Genera informe de confianza agrícola
 */

// Exportar el agente
export { AgriculturalValidationAgent } from './agent';

// Si se ejecuta directamente, mostrar información
if (require.main === module) {
  console.log('🤖 Agente IA de Validación Agrícola');
  console.log('📋 Versión: 1.0.0');
  console.log('🌐 Red: Polygon Mainnet (Chain ID: 137)');
  console.log('');
  console.log('💡 Uso:');
  console.log('  import { AgriculturalValidationAgent } from "./agent";');
  console.log('  const agent = new AgriculturalValidationAgent();');
  console.log('  await agent.executeFullValidation(farmerAddress, documents);');
  console.log('');
  console.log('📚 Ver README.md para más información');
  
  // Inicializar agente para verificar configuración
  try {
    const agent = new AgriculturalValidationAgent();
    console.log('✅ Agente inicializado correctamente');
  } catch (error: any) {
    console.warn('⚠️ Error al inicializar agente:', error.message);
  }
}

