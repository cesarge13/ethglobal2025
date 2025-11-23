import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, FileText, Clock } from 'lucide-react';
import { Verification, Document } from '../../services/agriculturalApi';
// Using native Date formatting instead of date-fns

interface VerificationHistoryProps {
  verifications: Verification[];
  documents: Document[];
}

export function VerificationHistory({ verifications, documents }: VerificationHistoryProps) {
  const stepNames: Record<number, string> = {
    1: 'Validación de Identidad',
    2: 'Validación de Certificaciones',
    3: 'Validación de Almacén',
    4: 'Validación de Cultivo',
  };

  if (verifications.length === 0 && documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Verificaciones</CardTitle>
          <CardDescription>No hay verificaciones registradas aún</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Sube documentos para comenzar el proceso de validación
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Verificaciones */}
      {verifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Verificaciones</CardTitle>
            <CardDescription>
              Historial de verificaciones realizadas por el agente IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {verifications.map((verification, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-start space-x-3">
                    {verification.status ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">
                          {stepNames[verification.step] || `Paso ${verification.step}`}
                        </h4>
                        <Badge variant={verification.status ? 'default' : 'destructive'}>
                          {verification.status ? 'Aprobado' : 'Rechazado'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {verification.details}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(verification.timestamp).toLocaleString('es-MX', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <span>Verificado por: {verification.verifiedBy.slice(0, 6)}...</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentos */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documentos Registrados</CardTitle>
            <CardDescription>
              Documentos subidos y registrados en blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">
                        {doc.docType.charAt(0).toUpperCase() + doc.docType.slice(1)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Hash: {doc.docHash.slice(0, 16)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.isValidated ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Badge variant="default">Validado</Badge>
                      </>
                    ) : (
                      <Badge variant="secondary">Pendiente</Badge>
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

