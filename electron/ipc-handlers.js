/**
 * IPC Handlers - Comunicação entre React (renderer) e Electron (main)
 * Inter

activeLeads Desktop - Sistema de Captação de Leads
 */

function setupIpcHandlers(ipcMain, db) {
  console.log('🔌 Configurando IPC handlers...');

  // Verificar se é a primeira execução (nenhum tenant cadastrado)
  ipcMain.handle('is-first-run', async () => {
    try {
      const count = await db.getTenantsCount();
      return count === 0;
    } catch (error) {
      console.error('❌ Erro ao verificar primeira execução:', error);
      return false;
    }
  });

  // ==================== TENANTS ====================

  // Criar novo tenant
  ipcMain.handle('create-tenant', async (event, tenantData) => {
    try {
      const { tenant_id: tenantId, brand_name: brandName, admin_password: adminPassword } = tenantData;
      
      console.log(`🆕 Criando novo tenant: ${tenantId} (${brandName})`);
      
      // Validar entrada
      if (!tenantId || !brandName || !adminPassword) {
        throw new Error('Todos os campos são obrigatórios');
      }

      if (adminPassword.length !== 4 || !/^\d+$/.test(adminPassword)) {
        throw new Error('A senha deve conter exatamente 4 dígitos numéricos');
      }

      // Verificar se o tenant já existe
      const existingTenant = db.getTenant(tenantId);
      if (existingTenant) {
        throw new Error('Já existe um tenant com este ID');
      }

      // Configuração padrão do tema
      const defaultTheme = {
        colors: {
          primary: '#3b82f6',
          secondary: '#10b981',
          accent: '#8b5cf6',
          background: '#ffffff',
          text: '#1f2937',
          text_secondary: '#6b7280',
          success: '#10b981',
          error: '#ef4444',
          button_primary_bg: '#3b82f6',
          button_primary_text: '#ffffff',
          button_secondary_bg: '#e5e7eb',
          button_secondary_text: '#1f2937',
          main_logo_url: '',
          center_logo_url: '',
          watermark_url: '',
        },
        spacing: {
          border_radius: '0.5rem',
          padding_base: '1rem',
        },
      };

      // Configuração inicial do tenant
      const newTenant = {
        tenant_id: tenantId,
        brand_name: brandName,
        theme: defaultTheme,
        content: {
          welcome_title: `Bem-vindo ao ${brandName}`,
          welcome_subtitle: 'Participe e concorra a prêmios incríveis!',
          form_title: 'Cadastre-se',
          form_subtitle: 'Preencha seus dados para participar',
          thank_you_message: 'Obrigado por participar!',
          privacy_notice: 'Seus dados estão seguros conosco.',
        },
        games_config: {
          enabled_games: ['prize_wheel'],
          prize_wheel: {
            prizes: [
              {
                id: 'p1',
                label: '10% OFF',
                name: 'Cupom de 10% de desconto',
                probability: 100,
                color: '#3b82f6',
                quantity_available: 1000,
                quantity_total: 1000,
                times_won: 0,
              },
            ],
          },
          scratch_card: {
            overlay_color: '#C0C0C0',
            prizes: [],
          },
          quiz: {
            questions: [],
            prize_rules: [],
          },
        },
        form_fields: {
          required: ['name', 'email', 'phone'],
          optional: [],
          custom_field: { enabled: false, label: '', type: 'select', options: [] },
        },
        behavior: {
          inactivity_timeout: 300,
          auto_return_home: true,
          show_lead_count: false,
          collect_photo: false,
          admin_password: adminPassword,
        },
      };

      // Salvar o novo tenant
      db.saveTenant(newTenant);
      
      console.log(`✅ Tenant criado com sucesso: ${tenantId}`);
      return { 
        success: true, 
        message: 'Tenant criado com sucesso',
        tenant: newTenant
      };
      
    } catch (error) {
      console.error('❌ Erro ao criar tenant:', error);
      
      // Verificar se é um erro de constraint única
      if (error.message && (error.message.includes('UNIQUE constraint failed') || error.message.includes('Já existe um tenant'))) {
        return { 
          success: false, 
          error: 'Já existe um tenant com este ID' 
        };
      }
      
      // Outros erros
      return { 
        success: false, 
        error: error.message || 'Falha ao criar o tenant' 
      };
    }
  });

  // Buscar configuração de tenant
  ipcMain.handle('tenant:get', async (event, tenantId) => {
    try {
      console.log(`📥 Buscando tenant: ${tenantId}`);
      const tenant = db.getTenant(tenantId);
      
      if (!tenant) {
        throw new Error('Tenant não encontrado');
      }
      
      console.log(`✅ Tenant encontrado: ${tenant.brand_name}`);
      return { success: true, data: tenant };
    } catch (error) {
      console.error('❌ Erro ao buscar tenant:', error);
      return { success: false, error: error.message };
    }
  });

  // Salvar/atualizar tenant
  ipcMain.handle('tenant:save', async (event, config) => {
    try {
      console.log(`💾 Salvando tenant: ${config.tenant_id}`);
      db.saveTenant(config);
      console.log(`✅ Tenant salvo com sucesso`);
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao salvar tenant:', error);
      return { success: false, error: error.message };
    }
  });

  // Listar todos os tenants
  ipcMain.handle('tenant:list', async () => {
    try {
      const tenants = db.getAllTenants();
      return { success: true, data: tenants };
    } catch (error) {
      console.error('❌ Erro ao listar tenants:', error);
      return { success: false, error: error.message };
    }
  });

  // Deletar tenant
  ipcMain.handle('tenant:delete', async (event, tenantId) => {
    try {
      console.log(`🗑️ Deletando tenant: ${tenantId}`);
      db.deleteTenant(tenantId);
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao deletar tenant:', error);
      return { success: false, error: error.message };
    }
  });

  // ==================== LEADS ====================

  // Salvar lead
  ipcMain.handle('lead:save', async (event, leadData) => {
    try {
      console.log(`📝 Salvando lead: ${leadData.name} (${leadData.email})`);
      const savedLead = db.saveLead(leadData);
      
      // Se houver prêmio, decrementar estoque
      if (leadData.prize_won && leadData.prize_id) {
        db.decrementPrizeStock(leadData.tenant_id, leadData.prize_id);
      }
      
      console.log(`✅ Lead salvo com ID: ${savedLead.id}`);
      return { success: true, data: savedLead };
    } catch (error) {
      console.error('❌ Erro ao salvar lead:', error);
      return { success: false, error: error.message };
    }
  });

  // Buscar lead por ID
  ipcMain.handle('lead:get', async (event, leadId) => {
    try {
      const lead = db.getLeadById(leadId);
      if (!lead) {
        throw new Error('Lead não encontrado');
      }
      return { success: true, data: lead };
    } catch (error) {
      console.error('❌ Erro ao buscar lead:', error);
      return { success: false, error: error.message };
    }
  });

  // Buscar leads
  ipcMain.handle('lead:list', async (event, tenantId, limit) => {
    try {
      const leads = db.getLeads(tenantId, limit);
      return { success: true, data: leads };
    } catch (error) {
      console.error('❌ Erro ao buscar leads:', error);
      return { success: false, error: error.message };
    }
  });

  // Contar leads
  ipcMain.handle('lead:count', async (event, tenantId) => {
    try {
      const count = db.getLeadsCount(tenantId);
      return { success: true, data: count };
    } catch (error) {
      console.error('❌ Erro ao contar leads:', error);
      return { success: false, error: error.message };
    }
  });

  // Atualizar lead
  ipcMain.handle('lead:update', async (event, leadId, updates) => {
    try {
      const updated = db.updateLead(leadId, updates);
      if (!updated) {
        throw new Error('Lead não encontrado ou nenhum campo atualizado');
      }
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao atualizar lead:', error);
      return { success: false, error: error.message };
    }
  });

  // Remover lead
  ipcMain.handle('lead:delete', async (event, leadId) => {
    try {
      const removed = db.deleteLead(leadId);
      if (!removed) {
        throw new Error('Lead não encontrado');
      }
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao remover lead:', error);
      return { success: false, error: error.message };
    }
  });

  // ==================== ESTOQUE DE PRÊMIOS ====================

  // Atualizar inventário de prêmio
  ipcMain.handle('prize:update-inventory', async (event, { tenantId, gameType, prizeId, updates }) => {
    try {
      db.updatePrizeInventory(tenantId, gameType, prizeId, updates);
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao atualizar inventário:', error);
      return { success: false, error: error.message };
    }
  });

  // Buscar inventário de prêmios
  ipcMain.handle('prize:get-inventory', async (event, tenantId, gameType) => {
    try {
      const inventory = db.getPrizeInventory(tenantId, gameType);
      return { success: true, data: inventory };
    } catch (error) {
      console.error('❌ Erro ao buscar inventário:', error);
      return { success: false, error: error.message };
    }
  });

  // Decrementar estoque de prêmio
  ipcMain.handle('prize:decrement', async (event, tenantId, prizeId) => {
    try {
      const success = db.decrementPrizeStock(tenantId, prizeId);
      if (!success) {
        throw new Error('Estoque insuficiente');
      }
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao decrementar estoque:', error);
      return { success: false, error: error.message };
    }
  });

  // Buscar prêmio por ID
  ipcMain.handle('prize:get', async (event, prizeId) => {
    try {
      const prize = db.getPrizeById(prizeId);
      if (!prize) {
        throw new Error('Prêmio não encontrado');
      }
      return { success: true, data: prize };
    } catch (error) {
      console.error('❌ Erro ao buscar prêmio:', error);
      return { success: false, error: error.message };
    }
  });

  // Remover prêmio
  ipcMain.handle('prize:delete', async (event, tenantId, prizeId) => {
    try {
      const removed = db.deletePrize(tenantId, prizeId);
      if (!removed) {
        throw new Error('Prêmio não encontrado');
      }
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao remover prêmio:', error);
      return { success: false, error: error.message };
    }
  });

  // ==================== ESTATÍSTICAS ====================

  // Buscar estatísticas
  ipcMain.handle('stats:get', async (event, tenantId) => {
    try {
      const stats = db.getStats(tenantId);
      return { success: true, data: stats };
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return { success: false, error: error.message };
    }
  });

  // ==================== BACKUP & EXPORT ====================

  // Exportar dados para JSON
  ipcMain.handle('data:export', async () => {
    try {
      console.log('📤 Exportando dados...');
      const data = db.exportToJSON();
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao exportar dados:', error);
      return { success: false, error: error.message };
    }
  });

  // Fazer backup do banco de dados
  ipcMain.handle('database:backup', async (event, backupPath) => {
    try {
      console.log(`💾 Fazendo backup em: ${backupPath}`);
      await db.backup(backupPath);
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao fazer backup:', error);
      return { success: false, error: error.message };
    }
  });

  // Otimizar banco de dados
  ipcMain.handle('database:optimize', async () => {
    try {
      console.log('🔧 Otimizando banco de dados...');
      db.vacuum();
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao otimizar:', error);
      return { success: false, error: error.message };
    }
  });

  // ==================== CONFIGURAÇÕES ====================

  // Buscar configuração
  ipcMain.handle('settings:get', async (event, key) => {
    try {
      const value = db.getSetting(key);
      return { success: true, data: value };
    } catch (error) {
      console.error('❌ Erro ao buscar configuração:', error);
      return { success: false, error: error.message };
    }
  });

  // Salvar configuração
  ipcMain.handle('settings:set', async (event, key, value) => {
    try {
      db.setSetting(key, value);
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao salvar configuração:', error);
      return { success: false, error: error.message };
    }
  });

  // Listar configurações
  ipcMain.handle('settings:list', async () => {
    try {
      const settings = db.getAllSettings();
      return { success: true, data: settings };
    } catch (error) {
      console.error('❌ Erro ao listar configurações:', error);
      return { success: false, error: error.message };
    }
  });

  // Remover configuração
  ipcMain.handle('settings:delete', async (event, key) => {
    try {
      const removed = db.deleteSetting(key);
      if (!removed) {
        throw new Error('Configuração não encontrada');
      }
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao remover configuração:', error);
      return { success: false, error: error.message };
    }
  });

  // ==================== APP INFO ====================

  // Buscar versão do app
  ipcMain.handle('app:version', async () => {
    const { app } = require('electron');
    return { success: true, data: app.getVersion() };
  });

  // Buscar caminho de dados do usuário
  ipcMain.handle('app:user-data-path', async () => {
    const { app } = require('electron');
    return { success: true, data: app.getPath('userData') };
  });

  // Verificar se é a primeira execução (nenhum tenant cadastrado)
  ipcMain.handle('app:is-first-run', async () => {
    try {
      const count = db.getTenantsCount();
      return { success: true, data: count === 0 };
    } catch (error) {
      console.error('❌ Erro ao verificar primeira execução:', error);
      return { success: false, error: error.message };
    }
  });

  console.log('✅ IPC handlers configurados!');
}

module.exports = { setupIpcHandlers };

