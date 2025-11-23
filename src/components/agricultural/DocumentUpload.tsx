import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { agriculturalAPI } from '../../services/agriculturalApi';

interface DocumentUploadProps {
  farmerAddress: string;
  onUploadSuccess?: () => void;
}

export function DocumentUpload({ farmerAddress, onUploadSuccess }: DocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [docType, setDocType] = useState<string>('identity');
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Selecciona al menos un archivo');
      return;
    }

    if (!docType) {
      toast.error('Selecciona el tipo de documento');
      return;
    }

    try {
      setUploading(true);
      setUploadResults([]);

      const result = await agriculturalAPI.uploadDocuments(farmerAddress, files, docType);

      setUploadResults(result.documents);
      
      // Mostrar mensaje apropiado según el resultado
      if (result.success && result.registeredCount === files.length) {
        toast.success(`✅ ${result.message}`);
      } else if (result.registeredCount > 0) {
        toast.warning(`⚠️ ${result.message}`);
      } else {
        toast.error(`❌ ${result.message}`);
        
        // Si necesita PRIVATE_KEY, mostrar mensaje más específico
        if (result.needsPrivateKey) {
          toast.error('El backend necesita PRIVATE_KEY configurada. Ver SOLUCION_PRIVATE_KEY.md', {
            duration: 10000,
          });
        }
      }

      // Limpiar formulario
      setFiles([]);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      console.error('Error completo al subir documentos:', error);
      const errorMessage = error.message || 'Error desconocido al subir documentos';
      toast.error(`Error al subir documentos: ${errorMessage}`, {
        duration: 10000,
      });
      
      // Mostrar detalles del error en consola para debugging
      if (error.response) {
        console.error('Respuesta del servidor:', error.response);
      }
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Subir Documentos</span>
          </CardTitle>
          <CardDescription>
            Sube tus documentos agrícolas para validación. Formatos soportados: PDF, JPEG, PNG
            <br />
            <span className="text-xs text-blue-600 dark:text-blue-400 mt-2 block p-2 bg-blue-50 dark:bg-blue-500/10 rounded">
              ℹ️ <strong>Importante:</strong> El backend firmará la transacción automáticamente. 
              Tu wallet de MetaMask NO necesita firmar. Solo se usa para identificarte.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="docType">Tipo de Documento</Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger id="docType">
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="identity">Identidad (INE, CURP, RFC)</SelectItem>
                <SelectItem value="certification">Certificación (SAGARPA, SENASICA, Orgánico)</SelectItem>
                <SelectItem value="warehouse">Almacén/Bodega</SelectItem>
                <SelectItem value="crop">Cultivo/Cosecha</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">Seleccionar Archivos</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="files"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={uploading}
                className="cursor-pointer"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Máximo 10 archivos. Tamaño máximo: 10MB por archivo
            </p>
          </div>

          {files.length > 0 && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Archivos seleccionados ({files.length}):</p>
              <ul className="list-disc list-inside space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="w-full"
            size="lg"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo documentos...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Subir Documentos
              </>
            )}
          </Button>
          
          {files.length === 0 && (
            <p className="text-xs text-center text-muted-foreground">
              Selecciona archivos para habilitar el botón de subida
            </p>
          )}
        </CardContent>
      </Card>

      {uploadResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de la Subida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">{result.filename}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {result.registered ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">Registrado</span>
                        {result.txHash && (
                          <a
                            href={`https://polygonscan.com/tx/${result.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Ver TX
                          </a>
                        )}
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-500">
                          {result.error || 'Error'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

