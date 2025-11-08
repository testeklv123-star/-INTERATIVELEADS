/**
 * Rotas para gerenciamento de tenants
 */

const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');

/**
 * POST /api/tenants
 * Criar um novo tenant
 * Body: { name: "Nome do Cliente", slug: "cliente-slug" }
 */
router.post('/', tenantController.createTenant);

/**
 * GET /api/tenants
 * Listar todos os tenants
 */
router.get('/', tenantController.getAllTenants);

/**
 * GET /api/tenants/current
 * Obter o tenant atual do totem
 */
router.get('/current', tenantController.getCurrentTenant);

/**
 * POST /api/tenants/set-current
 * Definir o tenant atual do totem
 * Body: { slug: "loja-exemplo-001" }
 */
router.post('/set-current', tenantController.setCurrentTenant);

/**
 * GET /api/tenants/:slug
 * Buscar um tenant específico pelo slug
 */
router.get('/:slug', tenantController.getTenantBySlug);

module.exports = router;

