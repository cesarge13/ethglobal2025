import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { 
  Bot, 
  Plus, 
  Trash2, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Settings,
  BarChart3,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface AutoPayRule {
  id: string;
  farmerAddress: string;
  trigger: string;
  condition?: string;
  action: string;
  amount?: string;
  enabled: boolean;
  createdAt: string;
  executionCount: number;
}

interface AutoPayStats {
  totalRules: number;
  activeRules: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
}

export function AutoPayManager() {
  const { address } = useAccount();
  const [rules, setRules] = useState<AutoPayRule[]>([]);
  const [stats, setStats] = useState<AutoPayStats | null>(null);
  const [loadingRules, setLoadingRules] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [creatingRule, setCreatingRule] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state
  const [newRule, setNewRule] = useState({
    trigger: 'document_validated',
    action: 'document_validation',
    amount: '',
    enabled: true,
    condition: '',
  });

  useEffect(() => {
    loadRules();
    loadStats();
  }, [address]);

  const loadRules = async () => {
    if (!address) return;
    try {
      setLoadingRules(true);
      const response = await fetch(`${API_BASE_URL}/api/autopay/rules?farmerAddress=${address}`);
      if (!response.ok) throw new Error('Error al cargar reglas');
      const data = await response.json();
      setRules(data.rules || []);
    } catch (error: any) {
      toast.error(`Error al cargar reglas: ${error.message}`);
    } finally {
      setLoadingRules(false);
    }
  };

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const response = await fetch(`${API_BASE_URL}/api/autopay/stats`);
      if (!response.ok) throw new Error('Error al cargar estadísticas');
      const data = await response.json();
      setStats(data.stats);
    } catch (error: any) {
      toast.error(`Error al cargar estadísticas: ${error.message}`);
    } finally {
      setLoadingStats(false);
    }
  };

  const createRule = async () => {
    if (!address) {
      toast.error('Conecta tu wallet primero');
      return;
    }

    try {
      setCreatingRule(true);
      const response = await fetch(`${API_BASE_URL}/api/autopay/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerAddress: address,
          trigger: newRule.trigger,
          action: newRule.action,
          amount: newRule.amount || undefined,
          enabled: newRule.enabled,
          condition: newRule.condition || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear regla');
      }

      toast.success('✅ Regla de AutoPay creada exitosamente');
      setShowCreateForm(false);
      setNewRule({
        trigger: 'document_validated',
        action: 'document_validation',
        amount: '',
        enabled: true,
        condition: '',
      });
      await loadRules();
      await loadStats();
    } catch (error: any) {
      toast.error(`Error al crear regla: ${error.message}`);
    } finally {
      setCreatingRule(false);
    }
  };

  const deleteRule = async (ruleId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta regla?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/autopay/rules/${ruleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar regla');

      toast.success('✅ Regla eliminada exitosamente');
      await loadRules();
      await loadStats();
    } catch (error: any) {
      toast.error(`Error al eliminar regla: ${error.message}`);
    }
  };

  const processTestEvent = async () => {
    if (!address) {
      toast.error('Conecta tu wallet primero');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/autopay/process-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'document_validated',
          data: {
            farmerAddress: address,
            documentHash: 'test_hash_' + Date.now(),
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al procesar evento');
      }

      const result = await response.json();
      toast.success(`✅ Evento procesado. ${result.executedRules} regla(s) ejecutada(s)`);
      await loadStats();
    } catch (error: any) {
      toast.error(`Error al procesar evento: ${error.message}`);
    }
  };

  const triggerLabels: Record<string, string> = {
    document_validated: 'Documento Validado',
    verification_completed: 'Verificación Completada',
    certification_added: 'Certificación Agregada',
    reputation_threshold: 'Umbral de Reputación',
  };

  const actionLabels: Record<string, string> = {
    document_validation: 'Validación de Documento',
    certification_check: 'Verificación de Certificación',
    verification_step: 'Paso de Verificación',
    report_generation: 'Generación de Informe',
  };

  return (
    <div className="space-y-4">
      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Estadísticas de AutoPay</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingStats ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold">{stats.totalRules}</div>
                <div className="text-xs text-muted-foreground">Total Reglas</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.activeRules}</div>
                <div className="text-xs text-muted-foreground">Reglas Activas</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold">{stats.totalExecutions}</div>
                <div className="text-xs text-muted-foreground">Total Ejecuciones</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.successfulExecutions}</div>
                <div className="text-xs text-muted-foreground">Exitosas</div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No se pudieron cargar las estadísticas</p>
          )}
          <Button onClick={loadStats} variant="outline" size="sm" className="w-full mt-4">
            Actualizar Estadísticas
          </Button>
        </CardContent>
      </Card>

      {/* Rules List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Reglas de AutoPay</span>
              </CardTitle>
              <CardDescription>
                Reglas automáticas para ejecutar micropagos x402
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Regla
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Create Rule Form */}
          {showCreateForm && (
            <Card className="border-2 border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">Crear Nueva Regla</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trigger">Trigger (Evento)</Label>
                  <Select value={newRule.trigger} onValueChange={(v) => setNewRule({ ...newRule, trigger: v })}>
                    <SelectTrigger id="trigger">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document_validated">Documento Validado</SelectItem>
                      <SelectItem value="verification_completed">Verificación Completada</SelectItem>
                      <SelectItem value="certification_added">Certificación Agregada</SelectItem>
                      <SelectItem value="reputation_threshold">Umbral de Reputación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="action">Acción x402</Label>
                  <Select value={newRule.action} onValueChange={(v) => setNewRule({ ...newRule, action: v })}>
                    <SelectTrigger id="action">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document_validation">Validación de Documento</SelectItem>
                      <SelectItem value="certification_check">Verificación de Certificación</SelectItem>
                      <SelectItem value="verification_step">Paso de Verificación</SelectItem>
                      <SelectItem value="report_generation">Generación de Informe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Cantidad (MATIC) - Opcional</Label>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="Dejar vacío para usar tarifa estándar"
                    value={newRule.amount}
                    onChange={(e) => setNewRule({ ...newRule, amount: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enabled">Habilitada</Label>
                  <Switch
                    id="enabled"
                    checked={newRule.enabled}
                    onCheckedChange={(checked) => setNewRule({ ...newRule, enabled: checked })}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={createRule} disabled={creatingRule} className="flex-1">
                    {creatingRule ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Regla
                      </>
                    )}
                  </Button>
                  <Button onClick={() => setShowCreateForm(false)} variant="outline">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rules List */}
          {loadingRules ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay reglas configuradas</p>
              <p className="text-sm">Crea una regla para comenzar</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">
                        {triggerLabels[rule.trigger] || rule.trigger}
                      </span>
                      {rule.enabled ? (
                        <Badge className="bg-green-500">Activa</Badge>
                      ) : (
                        <Badge variant="secondary">Inactiva</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Acción: {actionLabels[rule.action] || rule.action}
                      {rule.amount && ` • ${rule.amount} MATIC`}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Ejecuciones: {rule.executionCount} • Creada: {new Date(rule.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteRule(rule.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button onClick={loadRules} variant="outline" size="sm" className="w-full">
            Actualizar Reglas
          </Button>
        </CardContent>
      </Card>

      {/* Test Event */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Probar AutoPay</span>
          </CardTitle>
          <CardDescription>
            Procesa un evento de prueba para ejecutar las reglas activas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={processTestEvent} disabled={!address} className="w-full">
            <Play className="mr-2 h-4 w-4" />
            Procesar Evento de Prueba
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Esto ejecutará todas las reglas activas que coincidan con el evento "document_validated"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

