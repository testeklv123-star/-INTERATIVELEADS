/**
 * Controller para gerenciar requisições de leads
 */

const leadModelLocal = require('../models/leadModelLocal');

/**
 * Cria um novo lead localmente
 * @param {Request} req - Requisição Express
 * @param {Response} res - Resposta Express
 */
async function createLocalLead(req, res) {
  try {
    const { name, email, phone } = req.body;

    // Validação básica
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nome e email são obrigatórios',
      });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido',
      });
    }

    // Criar lead no banco local
    const lead = leadModelLocal.createLead({ name, email, phone });

    console.log('✅ Lead criado localmente:', lead.id);

    return res.status(201).json({
      success: true,
      message: 'Lead salvo localmente. Será sincronizado em instantes.',
      data: lead,
    });
  } catch (error) {
    console.error('❌ Erro ao criar lead:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao salvar lead. Por favor, tente novamente.',
      error: error.message,
    });
  }
}

/**
 * Busca todos os leads (para admin/debug)
 * @param {Request} req - Requisição Express
 * @param {Response} res - Resposta Express
 */
async function getAllLeads(req, res) {
  try {
    const leads = leadModelLocal.getAllLeads();
    const stats = leadModelLocal.getLeadsStats();

    return res.status(200).json({
      success: true,
      data: {
        leads,
        stats,
      },
    });
  } catch (error) {
    console.error('❌ Erro ao buscar leads:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar leads',
      error: error.message,
    });
  }
}

/**
 * Busca estatísticas de sincronização
 * @param {Request} req - Requisição Express
 * @param {Response} res - Resposta Express
 */
async function getStats(req, res) {
  try {
    const stats = leadModelLocal.getLeadsStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message,
    });
  }
}

module.exports = {
  createLocalLead,
  getAllLeads,
  getStats,
};

