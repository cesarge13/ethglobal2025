/**
 * API Service para conectar con el backend de validación agrícola
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface FarmerStatus {
  address: string;
  farmerId: string;
  isRegistered: boolean;
  reputationScore: number;
  totalVerifications: number;
  validCertifications: number;
  registrationDate: string;
  documents: Document[];
  verifications: Verification[];
  certifications: string[];
  lastUpdate: string;
}

export interface Document {
  docHash: string;
  docType: string;
  timestamp: string;
  isValidated: boolean;
  validatedBy: string;
}

export interface Verification {
  step: number;
  status: boolean;
  timestamp: string;
  verifiedBy: string;
  details: string;
}

export interface X402Payment {
  success: boolean;
  paymentId: string;
  farmerAddress: string;
  amount: string;
  action: string;
  txHash: string;
  status: string;
  polygonScanUrl: string;
}

export interface ValidationResult {
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
}

class AgriculturalAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Obtiene el estado completo del agricultor
   */
  async getFarmerStatus(address: string): Promise<FarmerStatus> {
    const response = await fetch(`${this.baseURL}/api/get-user-status/${address}`);
    if (!response.ok) {
      throw new Error(`Error al obtener estado: ${response.statusText}`);
    }
    const data = await response.json();
    return data.status;
  }

  /**
   * Sube documentos para validación
   */
  async uploadDocuments(
    farmerAddress: string,
    files: File[],
    docType: string
  ): Promise<{
    success: boolean;
    message: string;
    documents: any[];
    registeredCount?: number;
    failedCount?: number;
    needsPrivateKey?: boolean;
  }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('farmerAddress', farmerAddress);
    formData.append('docType', docType);

    const response = await fetch(`${this.baseURL}/api/upload-docs`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || response.statusText;
      throw new Error(`Error al subir documentos: ${errorMessage}`);
    }

    const result = await response.json();
    
    // Log para debugging
    console.log('Resultado de subida:', result);
    
    return result;
  }

  /**
   * Solicita verificación de documentos
   */
  async requestVerification(
    farmerAddress: string,
    documentHashes: string[]
  ): Promise<{
    success: boolean;
    verificationId: string;
    status: string;
    message: string;
  }> {
    const response = await fetch(`${this.baseURL}/api/request-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        farmerAddress,
        documentHashes,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al solicitar verificación: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Ejecuta un micropago x402
   */
  async executeX402Payment(
    farmerAddress: string,
    action: string,
    amount?: string
  ): Promise<X402Payment> {
    const response = await fetch(`${this.baseURL}/api/execute-x402-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        farmerAddress,
        action,
        amount,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Error al ejecutar micropago: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Actualiza la reputación del agricultor
   */
  async updateReputation(
    farmerAddress: string,
    newScore: number
  ): Promise<{
    success: boolean;
    farmerAddress: string;
    oldScore: number;
    newScore: number;
    txHash: string;
    polygonScanUrl: string;
  }> {
    const response = await fetch(`${this.baseURL}/api/update-reputation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        farmerAddress,
        newScore,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar reputación: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Obtiene las tarifas de micropagos x402
   */
  async getX402Rates(): Promise<{
    success: boolean;
    rates: Record<string, string>;
    network: string;
    currency: string;
  }> {
    const response = await fetch(`${this.baseURL}/api/x402-rates`);
    if (!response.ok) {
      throw new Error(`Error al obtener tarifas: ${response.statusText}`);
    }
    return await response.json();
  }

  /**
   * Obtiene el balance del wallet de micropagos
   */
  async getX402Balance(): Promise<{
    success: boolean;
    walletAddress: string;
    balance: string;
    balanceMatic: string;
  }> {
    const response = await fetch(`${this.baseURL}/api/x402-balance`);
    if (!response.ok) {
      throw new Error(`Error al obtener balance: ${response.statusText}`);
    }
    return await response.json();
  }

  /**
   * Genera un informe de confianza agrícola
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
  }> {
    const response = await fetch(`${this.baseURL}/api/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        farmerAddress,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al generar informe: ${response.statusText}`);
    }

    return await response.json();
  }
}

export const agriculturalAPI = new AgriculturalAPI();
export default agriculturalAPI;

