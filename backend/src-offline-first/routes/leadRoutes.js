/**
 * Rotas para gerenciamento de leads
 */

const express = require('express');
const leadController = require('../controllers/leadController');

const router = express.Router();

/**
 * POST /api/leads
 * Cria um novo lead no banco local
 */
router.post('/', leadController.createLocalLead);

/**
 * GET /api/leads
 * Busca todos os leads (admin/debug)
 */
router.get('/', leadController.getAllLeads);

/**
 * GET /api/leads/stats
 * Busca estatísticas de sincronização
 */
router.get('/stats', leadController.getStats);

module.exports = router;

