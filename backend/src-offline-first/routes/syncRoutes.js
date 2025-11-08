/**
 * Rotas para gerenciamento de sincronização
 */

const express = require('express');
const { getSyncStats, syncPendingLeads } = require('../services/syncService');

const router = express.Router();

/**
 * GET /api/sync/stats
 * Retorna estatísticas de sincronização
 */
router.get('/stats', (req, res) => {
  try {
    const stats = getSyncStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas de sincronização',
      error: error.message,
    });
  }
});

/**
 * POST /api/sync/trigger
 * Dispara sincronização manual
 */
router.post('/trigger', async (req, res) => {
  try {
    // Disparar sincronização em background
    syncPendingLeads().catch((err) => {
      console.error('Erro na sincronização manual:', err);
    });

    return res.status(200).json({
      success: true,
      message: 'Sincronização iniciada',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao iniciar sincronização',
      error: error.message,
    });
  }
});

module.exports = router;

