import { DocumentProcessor } from './services/document-processor';
import { LLMService } from './services/llm-service';
import { BlockchainService } from './services/blockchain-service';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Agente IA Principal para Validación Agrícola
 * 
 * Este agente:
 * 1. Procesa documentos agrícolas (PDF, imágenes)
 * 2. Valida identidad, certificaciones, almacenes, cultivos usando LLM
 * 3. Ejecuta micropagos x402 por cada acción
 * 4. Actualiza reputación on-chain
 * 5. Genera informe de confianza agrícola
 */
export class AgriculturalValidationAgent {
  private documentProcessor: DocumentProcessor;
  private llmService: LLMService;
  private blockchainService: BlockchainService;

  // Tarifas de micropagos por acción (en MATIC)
  private readonly PAYMENT_RATES = {
    document_validation: '0.001',
    certification_check: '0.002',
    verification_step: '0.0005',
    report_generation: '0.003',
  };

  constructor() {
    this.documentProcessor = new DocumentProcessor();
    this.llmService = new LLMService();
    this.blockchainService = new BlockchainService();
  }

  /**
   * Procesa múltiples documentos de un agricultor
   */
  async processDocuments(
    farmerAddress: string,
    documentPaths: string[]
  ): Promise<{
    success: boolean;
    results: Array<{
      documentPath: string;
      docType: string;
      isValid: boolean;
      confidence: number;
      txHash?: string;
      paymentHash?: string;
      error?: string;
    }>;
    totalPayments: number;
    totalAmount: string;
  }> {
    const results = [];
    let totalPayments = 0;
    let totalAmount = 0;

    for (const docPath of documentPaths) {
      try {
        // 1. Procesar documento
        const processed = await this.documentProcessor.processDocument(docPath);
        
        // 2. Detectar tipo de documento
        const detectedType = this.documentProcessor.detectDocumentType(processed.content);
        const docType: 'identity' | 'certification' | 'warehouse' | 'crop' = 
          detectedType === 'unknown' ? 'identity' : detectedType;
        
        // 3. Analizar con LLM
        const analysis = await this.llmService.analyzeDocument(processed.content, docType);
        
        // 4. Registrar documento en blockchain
        let txHash: string | undefined;
        try {
          txHash = await this.blockchainService.registerDocument(
            farmerAddress,
            processed.hash,
            docType
          );
        } catch (error: any) {
          console.warn(`No se pudo registrar documento ${docPath}:`, error.message);
        }

        // 5. Ejecutar micropago x402
        let paymentHash: string | undefined;
        try {
          const amount = this.PAYMENT_RATES.document_validation;
          paymentHash = await this.blockchainService.executeX402Payment(
            farmerAddress,
            amount,
            'document_validation'
          );
          totalPayments++;
          totalAmount += parseFloat(amount);
        } catch (error: any) {
          console.warn(`No se pudo ejecutar micropago para ${docPath}:`, error.message);
        }

        results.push({
          documentPath: docPath,
          docType,
          isValid: analysis.isValid,
          confidence: analysis.confidence,
          txHash,
          paymentHash,
        });
      } catch (error: any) {
        results.push({
          documentPath: docPath,
          docType: 'unknown',
          isValid: false,
          confidence: 0,
          error: error.message,
        });
      }
    }

    return {
      success: results.length > 0,
      results,
      totalPayments,
      totalAmount: totalAmount.toFixed(6),
    };
  }

  /**
   * Valida la identidad del agricultor (Paso 1)
   */
  async validateIdentity(
    farmerAddress: string,
    identityDocPath: string
  ): Promise<{
    isValid: boolean;
    confidence: number;
    step: number;
    txHash?: string;
    paymentHash?: string;
    details: string;
  }> {
    try {
      // Procesar documento de identidad
      const processed = await this.documentProcessor.processDocument(identityDocPath);
      const analysis = await this.llmService.analyzeDocument(processed.content, 'identity');

      // Registrar verificación en blockchain
      let txHash: string | undefined;
      try {
        txHash = await this.blockchainService.logVerification(
          farmerAddress,
          1, // Paso 1: Identidad
          analysis.isValid,
          analysis.validationDetails
        );
      } catch (error: any) {
        console.warn('No se pudo registrar verificación de identidad:', error.message);
      }

      // Ejecutar micropago
      let paymentHash: string | undefined;
      try {
        paymentHash = await this.blockchainService.executeX402Payment(
          farmerAddress,
          this.PAYMENT_RATES.verification_step,
          'verification_step'
        );
      } catch (error: any) {
        console.warn('No se pudo ejecutar micropago de verificación:', error.message);
      }

      return {
        isValid: analysis.isValid,
        confidence: analysis.confidence,
        step: 1,
        txHash,
        paymentHash,
        details: analysis.validationDetails,
      };
    } catch (error: any) {
      return {
        isValid: false,
        confidence: 0,
        step: 1,
        details: `Error: ${error.message}`,
      };
    }
  }

  /**
   * Valida certificaciones (Paso 2)
   */
  async validateCertifications(
    farmerAddress: string,
    certificationDocPaths: string[]
  ): Promise<{
    isValid: boolean;
    confidence: number;
    step: number;
    certifications: Array<{
      docPath: string;
      isValid: boolean;
      confidence: number;
    }>;
    txHash?: string;
    paymentHash?: string;
  }> {
    const certifications = [];

    for (const docPath of certificationDocPaths) {
      try {
        const processed = await this.documentProcessor.processDocument(docPath);
        const analysis = await this.llmService.analyzeDocument(processed.content, 'certification');
        
        certifications.push({
          docPath,
          isValid: analysis.isValid,
          confidence: analysis.confidence,
        });
      } catch (error: any) {
        certifications.push({
          docPath,
          isValid: false,
          confidence: 0,
        });
      }
    }

    const overallValid = certifications.some(c => c.isValid);
    const avgConfidence = certifications.reduce((sum, c) => sum + c.confidence, 0) / certifications.length;

    // Registrar verificación
    let txHash: string | undefined;
    try {
      txHash = await this.blockchainService.logVerification(
        farmerAddress,
        2, // Paso 2: Certificaciones
        overallValid,
        `Validadas ${certifications.length} certificaciones`
      );
    } catch (error: any) {
      console.warn('No se pudo registrar verificación de certificaciones:', error.message);
    }

    // Ejecutar micropago
    let paymentHash: string | undefined;
    try {
      paymentHash = await this.blockchainService.executeX402Payment(
        farmerAddress,
        this.PAYMENT_RATES.certification_check,
        'certification_check'
      );
    } catch (error: any) {
      console.warn('No se pudo ejecutar micropago de certificaciones:', error.message);
    }

    return {
      isValid: overallValid,
      confidence: avgConfidence,
      step: 2,
      certifications,
      txHash,
      paymentHash,
    };
  }

  /**
   * Genera un informe completo de confianza agrícola
   */
  async generateReport(farmerAddress: string): Promise<{
    farmerAddress: string;
    reputationScore: number;
    totalVerifications: number;
    validCertifications: number;
    verificationSteps: Array<{
      step: number;
      status: boolean;
      details: string;
    }>;
    reportHash?: string;
    paymentHash?: string;
  }> {
    try {
      // Obtener información del agricultor
      const farmerInfo = await this.blockchainService.getFarmerInfo(farmerAddress);

      // Generar informe (en producción, esto podría ser más complejo)
      const report = {
        farmerAddress,
        reputationScore: Number(farmerInfo.reputationScore),
        totalVerifications: Number(farmerInfo.totalVerifications),
        validCertifications: Number(farmerInfo.validCertifications),
        verificationSteps: [
          { step: 1, status: farmerInfo.totalVerifications > 0, details: 'Identidad verificada' },
          { step: 2, status: farmerInfo.validCertifications > 0, details: 'Certificaciones validadas' },
          { step: 3, status: farmerInfo.totalVerifications >= 2, details: 'Almacén verificado' },
          { step: 4, status: farmerInfo.totalVerifications >= 3, details: 'Cultivo verificado' },
        ],
      };

      // Ejecutar micropago por generación de informe
      let paymentHash: string | undefined;
      try {
        paymentHash = await this.blockchainService.executeX402Payment(
          farmerAddress,
          this.PAYMENT_RATES.report_generation,
          'report_generation'
        );
      } catch (error: any) {
        console.warn('No se pudo ejecutar micropago de informe:', error.message);
      }

      return {
        ...report,
        paymentHash,
      };
    } catch (error: any) {
      throw new Error(`Error generando informe: ${error.message}`);
    }
  }

  /**
   * Ejecuta el flujo completo de validación (4 pasos)
   */
  async executeFullValidation(
    farmerAddress: string,
    documents: {
      identity?: string;
      certifications?: string[];
      warehouse?: string;
      crop?: string;
    }
  ): Promise<{
    success: boolean;
    steps: Array<{
      step: number;
      name: string;
      status: boolean;
      confidence: number;
      txHash?: string;
      paymentHash?: string;
    }>;
    finalReputation: number;
    totalPayments: number;
    totalAmount: string;
  }> {
    const steps = [];
    let totalPayments = 0;
    let totalAmount = 0;

    // Paso 1: Validar Identidad
    if (documents.identity) {
      const identityResult = await this.validateIdentity(farmerAddress, documents.identity);
      steps.push({
        step: 1,
        name: 'Validación de Identidad',
        status: identityResult.isValid,
        confidence: identityResult.confidence,
        txHash: identityResult.txHash,
        paymentHash: identityResult.paymentHash,
      });
      if (identityResult.paymentHash) {
        totalPayments++;
        totalAmount += parseFloat(this.PAYMENT_RATES.verification_step);
      }
    }

    // Paso 2: Validar Certificaciones
    if (documents.certifications && documents.certifications.length > 0) {
      const certResult = await this.validateCertifications(farmerAddress, documents.certifications);
      steps.push({
        step: 2,
        name: 'Validación de Certificaciones',
        status: certResult.isValid,
        confidence: certResult.confidence,
        txHash: certResult.txHash,
        paymentHash: certResult.paymentHash,
      });
      if (certResult.paymentHash) {
        totalPayments++;
        totalAmount += parseFloat(this.PAYMENT_RATES.certification_check);
      }
    }

    // Paso 3: Validar Almacén
    if (documents.warehouse) {
      const processed = await this.documentProcessor.processDocument(documents.warehouse);
      const analysis = await this.llmService.analyzeDocument(processed.content, 'warehouse');
      
      let txHash: string | undefined;
      let paymentHash: string | undefined;
      
      try {
        txHash = await this.blockchainService.logVerification(
          farmerAddress,
          3,
          analysis.isValid,
          analysis.validationDetails
        );
        paymentHash = await this.blockchainService.executeX402Payment(
          farmerAddress,
          this.PAYMENT_RATES.verification_step,
          'verification_step'
        );
        totalPayments++;
        totalAmount += parseFloat(this.PAYMENT_RATES.verification_step);
      } catch (error: any) {
        console.warn('Error en validación de almacén:', error.message);
      }

      steps.push({
        step: 3,
        name: 'Validación de Almacén',
        status: analysis.isValid,
        confidence: analysis.confidence,
        txHash,
        paymentHash,
      });
    }

    // Paso 4: Validar Cultivo
    if (documents.crop) {
      const processed = await this.documentProcessor.processDocument(documents.crop);
      const analysis = await this.llmService.analyzeDocument(processed.content, 'crop');
      
      let txHash: string | undefined;
      let paymentHash: string | undefined;
      
      try {
        txHash = await this.blockchainService.logVerification(
          farmerAddress,
          4,
          analysis.isValid,
          analysis.validationDetails
        );
        paymentHash = await this.blockchainService.executeX402Payment(
          farmerAddress,
          this.PAYMENT_RATES.verification_step,
          'verification_step'
        );
        totalPayments++;
        totalAmount += parseFloat(this.PAYMENT_RATES.verification_step);
      } catch (error: any) {
        console.warn('Error en validación de cultivo:', error.message);
      }

      steps.push({
        step: 4,
        name: 'Validación de Cultivo',
        status: analysis.isValid,
        confidence: analysis.confidence,
        txHash,
        paymentHash,
      });
    }

    // Obtener reputación final
    const farmerInfo = await this.blockchainService.getFarmerInfo(farmerAddress);
    const finalReputation = Number(farmerInfo.reputationScore);

    return {
      success: steps.every(s => s.status),
      steps,
      finalReputation,
      totalPayments,
      totalAmount: totalAmount.toFixed(6),
    };
  }
}

