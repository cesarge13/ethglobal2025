import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Wallet, Zap, DollarSign, Loader2, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { agriculturalAPI, X402Payment } from '../../services/agriculturalApi';
import { useAccount } from 'wagmi';

export function X402Payments() {
  const { address } = useAccount();
  const [balance, setBalance] = useState<{ success: boolean; walletAddress: string; balance: string; balanceMatic: string } | null>(null);
  const [rates, setRates] = useState<Record<string, string> | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [loadingRates, setLoadingRates] = useState(false);
  const [executingPayment, setExecutingPayment] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('document_validation');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [lastPayment, setLastPayment] = useState<X402Payment | null>(null);

  useEffect(() => {
    loadBalance();
    loadRates();
  }, []);

  const loadBalance = async () => {
    if (!address) return;
    try {
      setLoadingBalance(true);
      const result = await agriculturalAPI.getX402Balance();
      setBalance(result);
    } catch (error: any) {
      toast.error(`Error al cargar balance: ${error.message}`);
    } finally {
      setLoadingBalance(false);
    }
  };

  const loadRates = async () => {
    try {
      setLoadingRates(true);
      const result = await agriculturalAPI.getX402Rates();
      setRates(result.rates);
    } catch (error: any) {
      toast.error(`Error al cargar tarifas: ${error.message}`);
    } finally {
      setLoadingRates(false);
    }
  };

  const executePayment = async () => {
    if (!address) {
      toast.error('Conecta tu wallet primero');
      return;
    }

    if (!selectedAction) {
      toast.error('Selecciona una acción');
      return;
    }

    try {
      setExecutingPayment(true);
      const amount = customAmount || undefined;
      const result = await agriculturalAPI.executeX402Payment(address, selectedAction, amount);
      setLastPayment(result);
      toast.success(`✅ Micropago ejecutado exitosamente!`);
      await loadBalance(); // Recargar balance después del pago
    } catch (error: any) {
      toast.error(`Error al ejecutar pago: ${error.message}`);
    } finally {
      setExecutingPayment(false);
    }
  };

  const actionLabels: Record<string, string> = {
    document_validation: 'Validación de Documento',
    certification_check: 'Verificación de Certificación',
    verification_step: 'Paso de Verificación',
    report_generation: 'Generación de Informe',
  };

  return (
    <div className="space-y-4">
      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Balance x402 Wallet</span>
          </CardTitle>
          <CardDescription>
            Balance del wallet de micropagos x402 en Polygon Mainnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingBalance ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : balance ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dirección del Wallet:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {balance.walletAddress.slice(0, 10)}...{balance.walletAddress.slice(-8)}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Balance:</span>
                <span className="text-2xl font-bold text-green-600">{balance.balanceMatic}</span>
              </div>
              <Button onClick={loadBalance} variant="outline" size="sm" className="w-full">
                Actualizar Balance
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No se pudo cargar el balance</p>
          )}
        </CardContent>
      </Card>

      {/* Rates Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Tarifas x402</span>
          </CardTitle>
          <CardDescription>
            Costos de micropagos por acción
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingRates ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : rates ? (
            <div className="space-y-2">
              {Object.entries(rates).map(([action, rate]) => (
                <div key={action} className="flex items-center justify-between p-2 border rounded-lg">
                  <span className="text-sm font-medium">
                    {actionLabels[action] || action}
                  </span>
                  <Badge variant="secondary">{rate}</Badge>
                </div>
              ))}
              <Button onClick={loadRates} variant="outline" size="sm" className="w-full mt-2">
                Actualizar Tarifas
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No se pudieron cargar las tarifas</p>
          )}
        </CardContent>
      </Card>

      {/* Execute Payment Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Ejecutar Micropago x402</span>
          </CardTitle>
          <CardDescription>
            Ejecuta un micropago x402 para una acción específica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action">Acción</Label>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger id="action">
                <SelectValue placeholder="Selecciona una acción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document_validation">Validación de Documento</SelectItem>
                <SelectItem value="certification_check">Verificación de Certificación</SelectItem>
                <SelectItem value="verification_step">Paso de Verificación</SelectItem>
                <SelectItem value="report_generation">Generación de Informe</SelectItem>
              </SelectContent>
            </Select>
            {rates && selectedAction && rates[selectedAction] && (
              <p className="text-xs text-muted-foreground">
                Tarifa estándar: {rates[selectedAction]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Cantidad (MATIC) - Opcional</Label>
            <Input
              id="amount"
              type="text"
              placeholder="Dejar vacío para usar tarifa estándar"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Si no especificas una cantidad, se usará la tarifa estándar para la acción seleccionada
            </p>
          </div>

          <Button
            onClick={executePayment}
            disabled={executingPayment || !address || !selectedAction}
            className="w-full"
            size="lg"
          >
            {executingPayment ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ejecutando micropago...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Ejecutar Micropago
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Last Payment Result */}
      {lastPayment && (
        <Card>
          <CardHeader>
            <CardTitle>Último Pago Ejecutado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estado:</span>
              {lastPayment.success ? (
                <Badge className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Exitoso
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Fallido
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Acción:</span>
              <span className="text-sm font-medium">
                {actionLabels[lastPayment.action] || lastPayment.action}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cantidad:</span>
              <span className="text-sm font-medium">{lastPayment.amount} MATIC</span>
            </div>
            {lastPayment.txHash && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Transacción:</span>
                <a
                  href={lastPayment.polygonScanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline flex items-center space-x-1"
                >
                  <span>{lastPayment.txHash.slice(0, 10)}...</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
