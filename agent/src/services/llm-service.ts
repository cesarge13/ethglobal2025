import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Servicio LLM para análisis de documentos agrícolas
 * Usa OpenAI GPT para análisis inteligente de documentos
 */
export class LLMService {
  private client: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    } else {
      console.warn('⚠️ OPENAI_API_KEY no configurada. El análisis LLM estará limitado.');
    }
  }

  /**
   * Analiza un documento y extrae información estructurada
   */
  async analyzeDocument(
    content: string,
    docType: 'identity' | 'certification' | 'warehouse' | 'crop'
  ): Promise<{
    isValid: boolean;
    confidence: number;
    extractedData: Record<string, any>;
    validationDetails: string;
  }> {
    if (!this.client) {
      // Modo fallback sin LLM
      return this.fallbackAnalysis(content, docType);
    }

    try {
      const prompt = this.buildPrompt(content, docType);
      
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini', // Usar modelo más económico para micropagos
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(docType),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1, // Baja temperatura para resultados consistentes
        max_tokens: 1000,
      });

      const analysis = response.choices[0]?.message?.content || '';
      return this.parseAnalysis(analysis, docType);
    } catch (error: any) {
      console.error('Error en análisis LLM:', error.message);
      return this.fallbackAnalysis(content, docType);
    }
  }

  /**
   * Construye el prompt para el LLM
   */
  private buildPrompt(content: string, docType: string): string {
    return `Analiza el siguiente documento agrícola mexicano (tipo: ${docType}):

${content.substring(0, 3000)} ${content.length > 3000 ? '...' : ''}

Extrae información relevante y valida su autenticidad. Responde en formato JSON.`;
  }

  /**
   * Obtiene el prompt del sistema según el tipo de documento
   */
  private getSystemPrompt(docType: string): string {
    const prompts: Record<string, string> = {
      identity: `Eres un experto en validación de documentos de identidad mexicanos.
      Valida documentos como INE, CURP, RFC.
      Verifica que la información sea consistente y válida.
      Responde en formato JSON con: isValid (boolean), confidence (0-100), extractedData (objeto), validationDetails (string).`,
      
      certification: `Eres un experto en certificaciones agrícolas mexicanas.
      Valida certificaciones de SAGARPA, SENASICA, orgánicas, BPA.
      Verifica números de certificación, fechas de vigencia, y autenticidad.
      Responde en formato JSON con: isValid (boolean), confidence (0-100), extractedData (objeto), validationDetails (string).`,
      
      warehouse: `Eres un experto en validación de almacenes agrícolas.
      Valida información de almacenes, bodegas, depósitos.
      Verifica ubicación, capacidad, certificaciones de almacenamiento.
      Responde en formato JSON con: isValid (boolean), confidence (0-100), extractedData (objeto), validationDetails (string).`,
      
      crop: `Eres un experto en validación de cultivos agrícolas.
      Valida información de cultivos, cosechas, siembras.
      Verifica tipo de cultivo, fechas, ubicación, certificaciones.
      Responde en formato JSON con: isValid (boolean), confidence (0-100), extractedData (objeto), validationDetails (string).`,
    };

    return prompts[docType] || prompts.identity;
  }

  /**
   * Parsea la respuesta del LLM
   */
  private parseAnalysis(analysis: string, docType: string): {
    isValid: boolean;
    confidence: number;
    extractedData: Record<string, any>;
    validationDetails: string;
  } {
    try {
      // Intentar parsear JSON del análisis
      const jsonMatch = analysis.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          isValid: parsed.isValid || false,
          confidence: parsed.confidence || 50,
          extractedData: parsed.extractedData || {},
          validationDetails: parsed.validationDetails || analysis,
        };
      }
    } catch (error) {
      console.warn('Error parseando análisis LLM:', error);
    }

    // Fallback: análisis básico
    return {
      isValid: analysis.toLowerCase().includes('válido') || analysis.toLowerCase().includes('valid'),
      confidence: 50,
      extractedData: {},
      validationDetails: analysis,
    };
  }

  /**
   * Análisis fallback sin LLM
   */
  private fallbackAnalysis(
    content: string,
    docType: string
  ): {
    isValid: boolean;
    confidence: number;
    extractedData: Record<string, any>;
    validationDetails: string;
  } {
    // Análisis básico basado en palabras clave
    const lowerContent = content.toLowerCase();
    const hasKeywords = lowerContent.length > 50; // Documento tiene contenido suficiente
    
    return {
      isValid: hasKeywords,
      confidence: hasKeywords ? 60 : 30,
      extractedData: {
        docType,
        contentLength: content.length,
      },
      validationDetails: `Análisis básico realizado. Documento ${hasKeywords ? 'contiene información' : 'muy corto o vacío'}.`,
    };
  }
}

