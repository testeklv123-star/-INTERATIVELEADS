/**
 * Serviço para gerenciar tenants (clientes)
 * Este serviço busca informações dos tenants no Supabase
 */

const supabase = require('../config/supabaseClient');
const db = require('../config/databaseLocal');

/**
 * Busca um tenant pelo slug no Supabase
 * @param {string} slug - Slug único do tenant (ex: 'loja-exemplo-001')
 * @returns {Object|null} Dados do tenant ou null se não encontrado
 */
async function getTenantBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('id, name, slug, created_at')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('❌ Erro ao buscar tenant:', error.message);
      return null;
    }

    if (!data) {
      console.warn(`⚠️  Tenant com slug "${slug}" não encontrado no Supabase`);
      return null;
    }

    console.log(`✅ Tenant encontrado: ${data.name} (${data.slug})`);
    return data;
  } catch (error) {
    console.error('❌ Erro ao buscar tenant:', error.message);
    return null;
  }
}

/**
 * Busca todos os tenants do Supabase
 * @returns {Array} Lista de todos os tenants
 */
async function getAllTenants() {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('id, name, slug, created_at')
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar tenants:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Erro ao buscar tenants:', error.message);
    return [];
  }
}

/**
 * Busca o tenant atual configurado no banco local
 * @returns {string} Slug do tenant atual
 */
function getCurrentTenantSlug() {
  try {
    // Primeiro, tentar pegar do ambiente
    if (process.env.CURRENT_TENANT_SLUG) {
      return process.env.CURRENT_TENANT_SLUG;
    }

    // Se não estiver no ambiente, buscar do banco local
    const stmt = db.prepare('SELECT slug FROM current_tenant WHERE id = 1');
    const result = stmt.get();

    if (result) {
      return result.slug;
    }

    // Fallback para tenant padrão
    console.warn('⚠️  Tenant atual não configurado. Usando tenant padrão.');
    return 'loja-exemplo-001';
  } catch (error) {
    console.error('❌ Erro ao buscar tenant atual:', error.message);
    return 'loja-exemplo-001';
  }
}

/**
 * Define o tenant atual no banco local
 * @param {string} slug - Slug do tenant
 * @returns {boolean} Sucesso ou falha
 */
function setCurrentTenantSlug(slug) {
  try {
    const stmt = db.prepare(`
      INSERT INTO current_tenant (id, slug) VALUES (1, ?)
      ON CONFLICT(id) DO UPDATE SET slug = excluded.slug
    `);

    stmt.run(slug);
    console.log(`✅ Tenant atual configurado: ${slug}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao configurar tenant atual:', error.message);
    return false;
  }
}

/**
 * Valida se um tenant existe no Supabase
 * @param {string} slug - Slug do tenant
 * @returns {boolean} true se existe, false se não existe
 */
async function validateTenantExists(slug) {
  const tenant = await getTenantBySlug(slug);
  return tenant !== null;
}

module.exports = {
  getTenantBySlug,
  getAllTenants,
  getCurrentTenantSlug,
  setCurrentTenantSlug,
  validateTenantExists,
};

