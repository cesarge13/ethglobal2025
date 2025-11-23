import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Shield, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { agriculturalAPI, FarmerStatus } from '../../services/agriculturalApi';
import { useAccount } from 'wagmi';

interface ReputationScoreProps {
  farmerStatus: FarmerStatus;
  onUpdate?: () => void;
}

export function ReputationScore({ farmerStatus, onUpdate }: ReputationScoreProps) {
  const { address } = useAccount();
  const [updating, setUpdating] = useState(false);

  const score = farmerStatus.reputationScore;
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Muy Bueno';
    if (score >= 70) return 'Bueno';
    if (score >= 60) return 'Aceptable';
    if (score >= 40) return 'Bajo';
    return 'Muy Bajo';
  };

  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Score de Reputación Agrícola</span>
          </CardTitle>
          <CardDescription>
            Tu reputación se basa en verificaciones, certificaciones y validaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="text-2xl text-muted-foreground">/ 100</div>
            </div>
            <div>
              <Badge variant={getScoreBadgeVariant(score)} className="text-lg px-4 py-1">
                {getScoreLabel(score)}
              </Badge>
            </div>
            <Progress value={score} className="h-3" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{farmerStatus.totalVerifications}</div>
              <div className="text-sm text-muted-foreground">Verificaciones</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{farmerStatus.validCertifications}</div>
              <div className="text-sm text-muted-foreground">Certificaciones</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{farmerStatus.documents.length}</div>
              <div className="text-sm text-muted-foreground">Documentos</div>
            </div>
          </div>

          {/* Factors */}
          <div className="space-y-2">
            <h4 className="font-medium">Factores que afectan tu reputación:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${farmerStatus.totalVerifications > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                <span>Verificaciones completadas: +{farmerStatus.totalVerifications * 5} puntos</span>
              </li>
              <li className="flex items-center space-x-2">
                <Award className={`h-4 w-4 ${farmerStatus.validCertifications > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                <span>Certificaciones válidas: +{farmerStatus.validCertifications * 10} puntos</span>
              </li>
              <li className="flex items-center space-x-2">
                <FileText className={`h-4 w-4 ${farmerStatus.documents.length > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                <span>Documentos registrados: +{farmerStatus.documents.length * 2} puntos</span>
              </li>
            </ul>
          </div>

          {/* Tips */}
          {score < 80 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                    Mejora tu reputación
                  </h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                    Sube más documentos, completa verificaciones y obtén certificaciones para aumentar tu score.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for check icon
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

// Helper component for file icon
function FileText({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

