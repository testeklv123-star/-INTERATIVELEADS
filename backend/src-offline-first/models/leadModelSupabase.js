/**
 * Model para operações de leads no Supabase (banco central)
 */

const supabase = require('../config/supabaseClient');

/**
 * Cria um novo lead no Supabase
 * @param {Object} leadData - Dados do lead
 * @param {string} leadData.name - Nome do lead
 * @param {string} leadData.email - Email do lead
 * @param {string} [leadData.phone] - Telefone do lead (opcional)
 * @param {string} leadData.tenant_id - UUID do tenant (obrigatório para multi-tenancy)
 * @returns {Promise<Object>} Lead criado
 */
async function createLead(leadData) {
  const { name, email, phone, tenant_id } = leadData;

  // Validar que tenant_id foi fornecido
  if (!tenant_id) {
    throw new Error('tenant_id é obrigatório para criar um lead no Supabase');
  }

  const { data, error } = await supabase
    .from('leads')
    .insert([
      {
        name,
        email,
        phone: phone || null,
        tenant_id, // <-- Incluir o UUID do tenant
      },
    ])
    .select();

  if (error) {
    throw new Error(`Erro ao criar lead no Supabase: ${error.message}`);
  }

  return data[0];
}

/**
 * Verifica a conexão com o Supabase
 * @returns {Promise<boolean>} True se conectado, false caso contrário
 */
async function checkConnection() {
  try {
    const { error } = await supabase
      .from('leads')
      .select('id')
      .limit(1);

    return !error;
  } catch (err) {
    return false;
  }
}

module.exports = {
  createLead,
  checkConnection,
};

