import express from 'express';
import { ethers } from 'ethers';
import autoPayService from '../services/autopay';

const router = express.Router();

/**
 * POST /api/autopay/rules
 * Crea una nueva regla de AutoPay
 */
router.post('/rules', async (req, res) => {
  try {
    const { farmerAddress, trigger, condition, action, amount, enabled } = req.body;

    if (!farmerAddress) {
      return res.status(400).json({ error: 'farmerAddress es requerido' });
    }

    if (!ethers.isAddress(farmerAddress)) {
      return res.status(400).json({ error: 'Dirección inválida' });
    }

    if (!trigger) {
      return res.status(400).json({ error: 'trigger es requerido' });
    }

    const validTriggers = ['document_validated', 'verification_completed', 'certification_added', 'reputation_threshold'];
    if (!validTriggers.includes(trigger)) {
      return res.status(400).json({ 
        error: 'trigger inválido',
        validTriggers 
      });
    }

    if (!action) {
      return res.status(400).json({ error: 'action es requerido' });
    }

    const rule = autoPayService.createRule({
      farmerAddress,
      trigger: trigger as any,
      condition,
      action,
      amount,
      enabled: enabled !== undefined ? enabled : true,
    });

    res.json({
      success: true,
      rule,
      message: 'Regla de AutoPay creada exitosamente',
    });
  } catch (error: any) {
    console.error('Error creating autopay rule:', error);
    res.status(500).json({
      error: 'Error al crear regla de AutoPay',
      message: error.message,
    });
  }
});

/**
 * GET /api/autopay/rules
 * Obtiene todas las reglas de AutoPay
 */
router.get('/rules', (req, res) => {
  try {
    const { farmerAddress } = req.query;

    let rules;
    if (farmerAddress) {
      rules = autoPayService.getRulesForFarmer(farmerAddress as string);
    } else {
      rules = autoPayService.getActiveRules();
    }

    res.json({
      success: true,
      rules,
      count: rules.length,
    });
  } catch (error: any) {
    console.error('Error getting autopay rules:', error);
    res.status(500).json({
      error: 'Error al obtener reglas de AutoPay',
      message: error.message,
    });
  }
});

/**
 * PUT /api/autopay/rules/:ruleId
 * Actualiza una regla de AutoPay
 */
router.put('/rules/:ruleId', (req, res) => {
  try {
    const { ruleId } = req.params;
    const updates = req.body;

    const updatedRule = autoPayService.updateRule(ruleId, updates);

    if (!updatedRule) {
      return res.status(404).json({ error: 'Regla no encontrada' });
    }

    res.json({
      success: true,
      rule: updatedRule,
      message: 'Regla de AutoPay actualizada exitosamente',
    });
  } catch (error: any) {
    console.error('Error updating autopay rule:', error);
    res.status(500).json({
      error: 'Error al actualizar regla de AutoPay',
      message: error.message,
    });
  }
});

/**
 * DELETE /api/autopay/rules/:ruleId
 * Elimina una regla de AutoPay
 */
router.delete('/rules/:ruleId', (req, res) => {
  try {
    const { ruleId } = req.params;

    const deleted = autoPayService.deleteRule(ruleId);

    if (!deleted) {
      return res.status(404).json({ error: 'Regla no encontrada' });
    }

    res.json({
      success: true,
      message: 'Regla de AutoPay eliminada exitosamente',
    });
  } catch (error: any) {
    console.error('Error deleting autopay rule:', error);
    res.status(500).json({
      error: 'Error al eliminar regla de AutoPay',
      message: error.message,
    });
  }
});

/**
 * POST /api/autopay/process-event
 * Procesa un evento manualmente (útil para testing)
 */
router.post('/process-event', async (req, res) => {
  try {
    const { eventType, data } = req.body;

    if (!eventType) {
      return res.status(400).json({ error: 'eventType es requerido' });
    }

    const validEventTypes = ['document_validated', 'verification_completed', 'certification_added', 'reputation_updated'];
    if (!validEventTypes.includes(eventType)) {
      return res.status(400).json({ 
        error: 'eventType inválido',
        validEventTypes 
      });
    }

    if (!data || !data.farmerAddress) {
      return res.status(400).json({ error: 'data.farmerAddress es requerido' });
    }

    const results = await autoPayService.processEvent(eventType as any, data);

    res.json({
      success: true,
      eventType,
      data,
      results,
      executedRules: results.filter(r => r.executed).length,
      failedRules: results.filter(r => !r.executed).length,
    });
  } catch (error: any) {
    console.error('Error processing autopay event:', error);
    res.status(500).json({
      error: 'Error al procesar evento de AutoPay',
      message: error.message,
    });
  }
});

/**
 * GET /api/autopay/stats
 * Obtiene estadísticas de AutoPay
 */
router.get('/stats', (req, res) => {
  try {
    const stats = autoPayService.getStats();

    res.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('Error getting autopay stats:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas de AutoPay',
      message: error.message,
    });
  }
});

export { router as autopayRouter };

