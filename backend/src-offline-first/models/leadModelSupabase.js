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
 * @returns {Promise<Object>} Lead criado
 */
async function createLead(leadData) {
  const { name, email, phone } = leadData;

  const { data, error } = await supabase
    .from('leads')
    .insert([
      {
        name,
        email,
        phone: phone || null,
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

