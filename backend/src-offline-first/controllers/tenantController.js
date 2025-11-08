/**
 * Controller para gerenciar tenants (clientes)
 * IMPORTANTE: Use a chave service_role do Supabase para criar tenants
 */

const { createClient } = require('@supabase/supabase-js');
const tenantService = require('../services/tenantService');
require('dotenv').config();

// Cliente Supabase com service_role key (necessário para criar tenants)
// A service_role key bypassa RLS e permite operações administrativas
let supabaseAdmin = null;

// Inicializar cliente admin apenas se SUPABASE_SERVICE_KEY estiver configurado
if (process.env.SUPABASE_SERVICE_KEY) {
  supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        persistSession: false,
      },
    }
  );
  console.log('✅ Cliente Supabase Admin (service_role) inicializado');
} else {
  console.warn('⚠️  SUPABASE_SERVICE_KEY não configurado. Criação de tenants não estará disponível.');
}

/**
 * Cria um novo tenant
 * POST /api/tenants
 * Body: { name: "Nome do Cliente", slug: "cliente-slug" }
 */
async function createTenant(req, res) {
  try {
    // Verificar se o cliente admin está configurado
    if (!supabaseAdmin) {
      return res.status(503).json({
        success: false,
        message: 'Serviço de criação de tenants não disponível. Configure SUPABASE_SERVICE_KEY no .env',
      });
    }

    const { name, slug } = req.body;

    // Validação básica
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Nome e slug são obrigatórios',
      });
    }

    // Validar formato do slug (apenas letras minúsculas, números e hífens)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return res.status(400).json({
        success: false,
        message: 'Slug inválido. Use apenas letras minúsculas, números e hífens (ex: loja-exemplo-001)',
      });
    }

    // Criar tenant no Supabase usando service_role
    const { data, error } = await supabaseAdmin
      .from('tenants')
      .insert([{ name, slug }])
      .select();

    if (error) {
      // Verificar se o erro é de slug duplicado
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          message: `Slug "${slug}" já está em uso. Escolha outro slug único.`,
        });
      }

      console.error('❌ Erro ao criar tenant:', error);
      return res.status(400).json({
        success: false,
        message: 'Erro ao criar tenant',
        error: error.message,
      });
    }

    const tenant = data[0];
    console.log(`✅ Tenant criado: ${tenant.name} (${tenant.slug})`);

    return res.status(201).json({
      success: true,
      message: 'Tenant criado com sucesso',
      data: tenant,
    });
  } catch (error) {
    console.error('❌ Erro ao criar tenant:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar tenant',
      error: error.message,
    });
  }
}

/**
 * Lista todos os tenants
 * GET /api/tenants
 */
async function getAllTenants(req, res) {
  try {
    const tenants = await tenantService.getAllTenants();

    return res.status(200).json({
      success: true,
      data: tenants,
    });
  } catch (error) {
    console.error('❌ Erro ao buscar tenants:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar tenants',
      error: error.message,
    });
  }
}

/**
 * Busca um tenant pelo slug
 * GET /api/tenants/:slug
 */
async function getTenantBySlug(req, res) {
  try {
    const { slug } = req.params;
    const tenant = await tenantService.getTenantBySlug(slug);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: `Tenant "${slug}" não encontrado`,
      });
    }

    return res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (error) {
    console.error('❌ Erro ao buscar tenant:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar tenant',
      error: error.message,
    });
  }
}

/**
 * Define o tenant atual do totem
 * POST /api/tenants/set-current
 * Body: { slug: "loja-exemplo-001" }
 */
async function setCurrentTenant(req, res) {
  try {
    const { slug } = req.body;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Slug é obrigatório',
      });
    }

    // Verificar se o tenant existe no Supabase
    const tenant = await tenantService.getTenantBySlug(slug);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: `Tenant "${slug}" não encontrado no Supabase. Crie o tenant primeiro.`,
      });
    }

    // Definir como tenant atual no banco local
    const success = tenantService.setCurrentTenantSlug(slug);

    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao configurar tenant atual',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Tenant atual configurado: ${tenant.name}`,
      data: tenant,
    });
  } catch (error) {
    console.error('❌ Erro ao configurar tenant atual:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao configurar tenant atual',
      error: error.message,
    });
  }
}

/**
 * Retorna o tenant atual do totem
 * GET /api/tenants/current
 */
async function getCurrentTenant(req, res) {
  try {
    const slug = tenantService.getCurrentTenantSlug();
    const tenant = await tenantService.getTenantBySlug(slug);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: `Tenant atual "${slug}" não encontrado no Supabase`,
      });
    }

    return res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (error) {
    console.error('❌ Erro ao buscar tenant atual:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar tenant atual',
      error: error.message,
    });
  }
}

module.exports = {
  createTenant,
  getAllTenants,
  getTenantBySlug,
  setCurrentTenant,
  getCurrentTenant,
};

