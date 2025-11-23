import * as fs from 'fs';
import * as path from 'path';
import pdfParse from 'pdf-parse';
import sharp from 'sharp';

/**
 * Servicio para procesar documentos agrícolas
 * Soporta PDF e imágenes (JPEG, PNG)
 */
export class DocumentProcessor {
  /**
   * Procesa un documento y extrae texto/contenido
   */
  async processDocument(filePath: string): Promise<{
    type: 'pdf' | 'image';
    content: string;
    metadata: any;
    hash: string;
  }> {
    const ext = path.extname(filePath).toLowerCase();
    const fileBuffer = fs.readFileSync(filePath);

    if (ext === '.pdf') {
      return await this.processPDF(fileBuffer);
    } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      return await this.processImage(fileBuffer);
    } else {
      throw new Error(`Tipo de archivo no soportado: ${ext}`);
    }
  }

  /**
   * Procesa un PDF y extrae texto
   */
  private async processPDF(buffer: Buffer): Promise<{
    type: 'pdf';
    content: string;
    metadata: any;
    hash: string;
  }> {
    const data = await pdfParse(buffer);
    
    return {
      type: 'pdf',
      content: data.text,
      metadata: {
        pages: data.numpages,
        info: data.info,
      },
      hash: this.generateHash(buffer),
    };
  }

  /**
   * Procesa una imagen (OCR básico - en producción usar servicio OCR real)
   */
  private async processImage(buffer: Buffer): Promise<{
    type: 'image';
    content: string;
    metadata: any;
    hash: string;
  }> {
    // Obtener metadata de la imagen
    const metadata = await sharp(buffer).metadata();
    
    // En producción, aquí se usaría un servicio OCR real (Tesseract, Google Vision, etc.)
    // Por ahora, retornamos metadata básica
    return {
      type: 'image',
      content: `Imagen procesada: ${metadata.width}x${metadata.height}, formato: ${metadata.format}`,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      },
      hash: this.generateHash(buffer),
    };
  }

  /**
   * Genera hash SHA256 del documento
   */
  private generateHash(buffer: Buffer): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Detecta el tipo de documento basado en contenido
   */
  detectDocumentType(content: string): 'identity' | 'certification' | 'warehouse' | 'crop' | 'unknown' {
    const lowerContent = content.toLowerCase();

    // Detectar identidad
    if (
      lowerContent.includes('ine') ||
      lowerContent.includes('identificación') ||
      lowerContent.includes('curp') ||
      lowerContent.includes('rfc')
    ) {
      return 'identity';
    }

    // Detectar certificaciones
    if (
      lowerContent.includes('sagarpa') ||
      lowerContent.includes('senasica') ||
      lowerContent.includes('certificación') ||
      lowerContent.includes('certificado') ||
      lowerContent.includes('orgánico') ||
      lowerContent.includes('bpa')
    ) {
      return 'certification';
    }

    // Detectar almacén
    if (
      lowerContent.includes('almacén') ||
      lowerContent.includes('almacen') ||
      lowerContent.includes('bodega') ||
      lowerContent.includes('warehouse') ||
      lowerContent.includes('depósito')
    ) {
      return 'warehouse';
    }

    // Detectar cultivo
    if (
      lowerContent.includes('cultivo') ||
      lowerContent.includes('cosecha') ||
      lowerContent.includes('siembra') ||
      lowerContent.includes('semilla')
    ) {
      return 'crop';
    }

    return 'unknown';
  }
}

