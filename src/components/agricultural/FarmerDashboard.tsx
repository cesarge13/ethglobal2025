import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { agriculturalAPI, FarmerStatus } from '../../services/agriculturalApi';
import { Upload, CheckCircle, XCircle, FileText, Shield, TrendingUp, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentUpload } from './DocumentUpload';
import { VerificationHistory } from './VerificationHistory';
import { ReputationScore } from './ReputationScore';
import { X402Payments } from './X402Payments';
import { AutoPayManager } from './AutoPayManager';

interface FarmerDashboardProps {
  onNavigate?: (screen: string) => void;
}

export function FarmerDashboard({ onNavigate }: FarmerDashboardProps) {
  const { address, isConnected } = useAccount();
  const [farmerStatus, setFarmerStatus] = useState<FarmerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address && isConnected) {
      loadFarmerStatus();
    } else {
      setLoading(false);
    }
  }, [address, isConnected]);

  const loadFarmerStatus = async () => {
    if (!address) return;

    try {
      setLoading(true);
      setError(null);
      const status = await agriculturalAPI.getFarmerStatus(address);
      setFarmerStatus(status);
    } catch (err: any) {
      setError(err.message || 'Error al cargar estado del agricultor');
      toast.error('Error al cargar información');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected || !address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conecta tu Wallet</CardTitle>
          <CardDescription>
            Conecta tu wallet de Polygon para ver tu dashboard de validación agrícola
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Usa el botón de conexión en la parte superior para conectar tu wallet.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando información del agricultor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          <Button onClick={loadFarmerStatus} className="mt-4">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  const status = farmerStatus || {
    address,
    isRegistered: false,
    reputationScore: 0,
    totalVerifications: 0,
    validCertifications: 0,
    documents: [],
    verifications: [],
    certifications: [],
    farmerId: '',
    registrationDate: '',
    lastUpdate: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard del Agricultor</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona tu reputación agrícola y valida tus documentos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reputación</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.reputationScore}/100</div>
            <Progress value={status.reputationScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Score de confianza agrícola
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verificaciones</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.totalVerifications}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Total de verificaciones completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificaciones</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.validCertifications}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Certificaciones válidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status.isRegistered ? (
                <Badge className="bg-green-500">Registrado</Badge>
              ) : (
                <Badge variant="destructive">No Registrado</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {status.isRegistered ? 'Agricultor verificado' : 'Completa tu registro'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="reputation">Reputación</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="x402">x402 Payments</TabsTrigger>
          <TabsTrigger value="autopay">AutoPay</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <DocumentUpload
            farmerAddress={address}
            onUploadSuccess={loadFarmerStatus}
          />
        </TabsContent>

        <TabsContent value="reputation" className="space-y-4">
          <ReputationScore
            farmerStatus={status}
            onUpdate={loadFarmerStatus}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <VerificationHistory
            verifications={status.verifications}
            documents={status.documents}
          />
        </TabsContent>

        <TabsContent value="x402" className="space-y-4">
          <X402Payments />
        </TabsContent>

        <TabsContent value="autopay" className="space-y-4">
          <AutoPayManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

