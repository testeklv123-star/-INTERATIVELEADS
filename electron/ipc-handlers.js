// electron/ipc-handlers.js
const { ipcMain } = require('electron');
const { getDb } = require('./database');

// Helpers para Promises
const runQuery = (sql, params = []) => new Promise((resolve, reject) => {
  getDb().run(sql, params, function(err) {
    if (err) reject(err);
    else resolve({ id: this.lastID, changes: this.changes });
  });
});

const getQuery = (sql, params = []) => new Promise((resolve, reject) => {
  getDb().get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

const allQuery = (sql, params = []) => new Promise((resolve, reject) => {
  getDb().all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows || []);
  });
});

// Handler para verificar se é a primeira execução
ipcMain.handle('is-first-run', async () => {
  try {
    const count = await getQuery('SELECT COUNT(*) as count FROM tenants');
    return count.count === 0;
  } catch (error) {
    console.error('Erro ao verificar primeira execução:', error);
    return false;
  }
});

// Handler para obter todos os tenants
ipcMain.handle('get-all-tenants', async () => {
  console.log('🔍 [BACKEND] get-all-tenants chamado - iniciando busca...');
  try {
    // Verifica se o banco está disponível
    const db = getDb();
    if (!db) {
      console.error('❌ [BACKEND] Banco de dados não está disponível!');
      return { success: false, error: 'Database not ready' };
    }
    
    console.log('✅ [BACKEND] Banco de dados disponível, executando query...');
    const tenants = await allQuery('SELECT * FROM tenants');
    console.log(`✅ [BACKEND] Query executada. Encontrados ${tenants.length} tenant(s):`);
    tenants.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.brand_name} (${t.tenant_id})`);
    });
    
    if (tenants.length === 0) {
      console.warn('⚠️ [BACKEND] ATENÇÃO: Nenhum tenant encontrado no banco!');
    }
    
    return { success: true, data: tenants };
  } catch (error) {
    console.error('❌ [BACKEND] Erro ao buscar tenants:', error);
    console.error('❌ [BACKEND] Stack trace:', error.stack);
    return { success: false, error: error.message || 'Failed to fetch tenants.' };
  }
});

// Handler para criar um novo tenant
ipcMain.handle('create-tenant', async (event, tenantData) => {
  try {
    // Aceita tanto camelCase quanto snake_case
    const tenant_id = tenantData.tenant_id || tenantData.tenantId;
    const brand_name = tenantData.brand_name || tenantData.brandName;
    const admin_password = tenantData.admin_password || tenantData.adminPassword;
    
    const defaultTheme = JSON.stringify({
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        background: '#f3f4f6',
        text: '#111827',
      },
      logos: {
        main: '/assets/logo-placeholder.png',
        favicon: '/assets/favicon.ico',
      },
    });
    
    const defaultGamesConfig = JSON.stringify({
      wheel: { enabled: true, prizes: ['10% OFF', 'Brinde', 'Tente Novamente'] },
      scratch: { enabled: true, prizes: ['Ganhou', 'Tente Novamente'] },
      quiz: { enabled: true, questions: [] },
    });
    
    await runQuery(
      'INSERT INTO tenants (tenant_id, brand_name, admin_password, theme, games_config) VALUES (?, ?, ?, ?, ?)',
      [tenant_id, brand_name, admin_password, defaultTheme, defaultGamesConfig]
    );
    
    const newTenant = await getQuery('SELECT * FROM tenants WHERE tenant_id = ?', [tenant_id]);
    return { success: true, tenant: newTenant };
  } catch (error) {
    console.error('Erro ao criar tenant:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { success: false, error: 'Tenant ID already exists.' };
    }
    return { success: false, error: 'Failed to create tenant.' };
  }
});

// Handler para obter um tenant específico
ipcMain.handle('get-tenant', async (event, tenantId) => {
  console.log(`🔍 [BACKEND] get-tenant chamado para ID: ${tenantId}`);
  try {
    const tenant = await getQuery('SELECT * FROM tenants WHERE tenant_id = ?', [tenantId]);
    
    if (!tenant) {
      console.warn(`⚠️ [BACKEND] Tenant ${tenantId} não encontrado`);
      return { success: false, error: 'Tenant not found' };
    }
    
    // Parse JSON fields com valores padrão se não existirem
    const tenantData = {
      tenant_id: tenant.tenant_id,
      brand_name: tenant.brand_name,
      theme: JSON.parse(tenant.theme || '{}'),
      content: tenant.content ? JSON.parse(tenant.content) : {
        welcome_title: 'Bem-vindo!',
        welcome_subtitle: 'Participe e ganhe prêmios',
        form_title: 'Cadastre-se',
        form_subtitle: 'Preencha seus dados',
        thank_you_message: 'Obrigado!',
        privacy_notice: 'Política de privacidade.'
      },
      games_config: JSON.parse(tenant.games_config || '{}'),
      form_fields: tenant.form_fields ? JSON.parse(tenant.form_fields) : {
        required: ['name', 'email'],
        optional: ['phone'],
        custom_field: { enabled: false, label: '', type: 'text', options: [] }
      },
      behavior: tenant.behavior ? JSON.parse(tenant.behavior) : {
        inactivity_timeout: 30,
        auto_return_home: true,
        show_lead_count: false,
        collect_photo: false,
        admin_password: tenant.admin_password || '1234'
      },
      created_at: tenant.created_at
    };
    
    console.log(`✅ [BACKEND] Tenant encontrado: ${tenant.brand_name}`);
    return { success: true, data: tenantData };
  } catch (error) {
    console.error('❌ [BACKEND] Erro ao buscar tenant:', error);
    console.error('❌ [BACKEND] Stack:', error.stack);
    return { success: false, error: error.message };
  }
});

// Handler para salvar/atualizar tenant
ipcMain.handle('save-tenant', async (event, config) => {
  console.log(`💾 [BACKEND] save-tenant chamado para: ${config.tenant_id}`);
  try {
    // Verifica se o tenant já existe
    const existing = await getQuery('SELECT id FROM tenants WHERE tenant_id = ?', [config.tenant_id]);
    
    const theme = typeof config.theme === 'string' ? config.theme : JSON.stringify(config.theme);
    const content = typeof config.content === 'string' ? config.content : JSON.stringify(config.content || {});
    const gamesConfig = typeof config.games_config === 'string' ? config.games_config : JSON.stringify(config.games_config);
    const formFields = typeof config.form_fields === 'string' ? config.form_fields : JSON.stringify(config.form_fields || {});
    const behavior = typeof config.behavior === 'string' ? config.behavior : JSON.stringify(config.behavior || {});
    
    if (existing) {
      // UPDATE
      await runQuery(
        'UPDATE tenants SET brand_name = ?, theme = ?, content = ?, games_config = ?, form_fields = ?, behavior = ? WHERE tenant_id = ?',
        [config.brand_name, theme, content, gamesConfig, formFields, behavior, config.tenant_id]
      );
      console.log(`✅ [BACKEND] Tenant ${config.tenant_id} atualizado`);
    } else {
      // INSERT
      const adminPassword = config.behavior?.admin_password || '1234';
      await runQuery(
        'INSERT INTO tenants (tenant_id, brand_name, admin_password, theme, content, games_config, form_fields, behavior) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [config.tenant_id, config.brand_name, adminPassword, theme, content, gamesConfig, formFields, behavior]
      );
      console.log(`✅ [BACKEND] Tenant ${config.tenant_id} criado`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('❌ [BACKEND] Erro ao salvar tenant:', error);
    return { success: false, error: error.message };
  }
});

// Handler para deletar tenant
ipcMain.handle('delete-tenant', async (event, tenantId) => {
  console.log(`🗑️ [BACKEND] delete-tenant chamado para: ${tenantId}`);
  try {
    await runQuery('DELETE FROM tenants WHERE tenant_id = ?', [tenantId]);
    console.log(`✅ [BACKEND] Tenant ${tenantId} deletado`);
    return { success: true };
  } catch (error) {
    console.error('❌ [BACKEND] Erro ao deletar tenant:', error);
    return { success: false, error: error.message };
  }
});

// Handler para configurações
ipcMain.handle('get-setting', async (event, key) => {
  try {
    const setting = await getQuery('SELECT value FROM app_settings WHERE key = ?', [key]);
    return { success: true, data: setting ? setting.value : null };
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('set-setting', async (event, key, value) => {
  try {
    const existing = await getQuery('SELECT key FROM app_settings WHERE key = ?', [key]);
    
    if (existing) {
      await runQuery('UPDATE app_settings SET value = ? WHERE key = ?', [value, key]);
    } else {
      await runQuery('INSERT INTO app_settings (key, value) VALUES (?, ?)', [key, value]);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-setting', async (event, key) => {
  try {
    await runQuery('DELETE FROM app_settings WHERE key = ?', [key]);
    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar configuração:', error);
    return { success: false, error: error.message };
  }
});

// Handler para login do admin
ipcMain.handle('admin-login', async (event, { tenant_id, password }) => {
  try {
    const tenant = await getQuery('SELECT * FROM tenants WHERE tenant_id = ? AND admin_password = ?', [tenant_id, password]);
    if (tenant) {
      return { success: true, tenant };
    } else {
      return { success: false, error: 'Invalid tenant ID or password.' };
    }
  } catch (error) {
    console.error('Erro no login do admin:', error);
    return { success: false, error: 'An error occurred during login.' };
  }
});

console.log('🔌 Configurando IPC handlers...');
console.log('✅ IPC handlers configurados!');
