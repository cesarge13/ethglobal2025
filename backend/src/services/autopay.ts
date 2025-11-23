import * as dotenv from 'dotenv';
import * as path from 'path';
import x402Service from './x402';
import contractService from './contract';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Servicio AutoPay Extension
 * 
 * Permite configurar pagos automáticos basados en eventos del sistema.
 * Los pagos se ejecutan automáticamente cuando se cumplen ciertas condiciones.
 */
interface AutoPayRule {
  id: string;
  farmerAddress: string;
  trigger: 'document_validated' | 'verification_completed' | 'certification_added' | 'reputation_threshold';
  condition?: {
    minReputation?: number;
    verificationStep?: number;
  };
  action: string;
  amount?: string; // Cantidad personalizada (opcional)
  enabled: boolean;
  createdAt: Date;
  lastExecuted?: Date;
  executionCount: number;
}

class AutoPayService {
  private rules: Map<string, AutoPayRule> = new Map();
  private isProcessing: boolean = false;

  constructor() {
    // Cargar reglas desde configuración o base de datos (en producción)
    this.loadRules();
  }

  /**
   * Carga reglas de AutoPay (en producción, desde base de datos)
   */
  private loadRules(): void {
    // Por ahora, reglas vacías. En producción, cargar desde DB
    console.log('AutoPay: Reglas cargadas');
  }

  /**
   * Crea una nueva regla de AutoPay
   */
  createRule(rule: Omit<AutoPayRule, 'id' | 'createdAt' | 'executionCount'>): AutoPayRule {
    const id = `autopay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newRule: AutoPayRule = {
      ...rule,
      id,
      createdAt: new Date(),
      executionCount: 0,
    };

    this.rules.set(id, newRule);
    return newRule;
  }

  /**
   * Actualiza una regla existente
   */
  updateRule(ruleId: string, updates: Partial<AutoPayRule>): AutoPayRule | null {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      return null;
    }

    const updatedRule = { ...rule, ...updates };
    this.rules.set(ruleId, updatedRule);
    return updatedRule;
  }

  /**
   * Elimina una regla
   */
  deleteRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  /**
   * Obtiene todas las reglas de un agricultor
   */
  getRulesForFarmer(farmerAddress: string): AutoPayRule[] {
    return Array.from(this.rules.values())
      .filter(rule => rule.farmerAddress.toLowerCase() === farmerAddress.toLowerCase());
  }

  /**
   * Obtiene todas las reglas activas
   */
  getActiveRules(): AutoPayRule[] {
    return Array.from(this.rules.values()).filter(rule => rule.enabled);
  }

  /**
   * Procesa un evento y ejecuta reglas de AutoPay correspondientes
   */
  async processEvent(
    eventType: 'document_validated' | 'verification_completed' | 'certification_added' | 'reputation_updated',
    data: {
      farmerAddress: string;
      verificationStep?: number;
      reputationScore?: number;
    }
  ): Promise<Array<{
    ruleId: string;
    executed: boolean;
    txHash?: string;
    error?: string;
  }>> {
    if (this.isProcessing) {
      console.warn('AutoPay: Ya hay un proceso en ejecución');
      return [];
    }

    this.isProcessing = true;
    const results: Array<{
      ruleId: string;
      executed: boolean;
      txHash?: string;
      error?: string;
    }> = [];

    try {
      const activeRules = this.getActiveRules()
        .filter(rule => rule.farmerAddress.toLowerCase() === data.farmerAddress.toLowerCase())
        .filter(rule => {
          // Verificar si el trigger coincide
          if (eventType === 'document_validated' && rule.trigger === 'document_validated') {
            return true;
          }
          if (eventType === 'verification_completed' && rule.trigger === 'verification_completed') {
            if (rule.condition?.verificationStep) {
              return data.verificationStep === rule.condition.verificationStep;
            }
            return true;
          }
          if (eventType === 'certification_added' && rule.trigger === 'certification_added') {
            return true;
          }
          if (eventType === 'reputation_updated' && rule.trigger === 'reputation_threshold') {
            if (rule.condition?.minReputation && data.reputationScore) {
              return data.reputationScore >= rule.condition.minReputation;
            }
            return true;
          }
          return false;
        });

      for (const rule of activeRules) {
        try {
          const result = await x402Service.executePayment(
            rule.farmerAddress,
            rule.action,
            rule.amount
          );

          // Actualizar regla
          const updatedRule = this.updateRule(rule.id, {
            lastExecuted: new Date(),
            executionCount: rule.executionCount + 1,
          });

          results.push({
            ruleId: rule.id,
            executed: true,
            txHash: result.txHash,
          });

          console.log(`AutoPay: Regla ${rule.id} ejecutada exitosamente`);
        } catch (error: any) {
          results.push({
            ruleId: rule.id,
            executed: false,
            error: error.message,
          });

          console.error(`AutoPay: Error ejecutando regla ${rule.id}:`, error.message);
        }
      }
    } finally {
      this.isProcessing = false;
    }

    return results;
  }

  /**
   * Obtiene estadísticas de AutoPay
   */
  getStats(): {
    totalRules: number;
    activeRules: number;
    totalExecutions: number;
  } {
    const allRules = Array.from(this.rules.values());
    const activeRules = allRules.filter(rule => rule.enabled);
    const totalExecutions = allRules.reduce((sum, rule) => sum + rule.executionCount, 0);

    return {
      totalRules: allRules.length,
      activeRules: activeRules.length,
      totalExecutions,
    };
  }
}

// Exportar instancia singleton
export const autoPayService = new AutoPayService();
export default autoPayService;

