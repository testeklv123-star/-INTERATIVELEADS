// electron/ipc-handlers.js
const { ipcMain } = require('electron');
const { getDb } = require('./database');

// Função auxiliar para verificar se o banco está pronto
function ensureDbReady() {
  const db = getDb();
  if (!db) {
    throw new Error('Banco de dados não está inicializado. Aguarde a inicialização.');
  }
  return db;
}

// Função auxiliar para executar queries com Promise
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const db = ensureDbReady();
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const db = ensureDbReady();
      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const db = ensureDbReady();
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []); // Garantir que sempre retorne um array
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}


// Handler para verificar se é a primeira execução
ipcMain.handle('is-first-run', async () => {
  try {
    const count = await getQuery('SELECT COUNT(*) as count FROM tenants');
    return count.count === 0;
  } catch (error) {
    console.error('Erro ao verificar primeira execução:', error);
    return false; // Em caso de erro, assuma que não é a primeira execução
  }
});

// Handler para obter todos os tenants
ipcMain.handle('get-all-tenants', async () => {
  console.log('🔍 [IPC] get-all-tenants chamado');
  try {
    const tenants = await allQuery('SELECT * FROM tenants');
    console.log(`✅ [IPC] get-all-tenants retornou ${tenants.length} tenant(s):`, tenants);
    return { success: true, data: tenants || [] };
  } catch (error) {
    console.error('❌ [IPC] Erro ao buscar tenants:', error);
    return { success: false, error: error.message || 'Erro ao buscar tenants' };
  }
});

// Handler para criar um novo tenant
ipcMain.handle('create-tenant', async (event, tenantData) => {
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

  try {
    const result = await runQuery(
      'INSERT INTO tenants (tenant_id, brand_name, admin_password, theme, games_config) VALUES (?, ?, ?, ?, ?)',
      [tenant_id, brand_name, admin_password, defaultTheme, defaultGamesConfig]
    );
    const newTenant = await getQuery('SELECT * FROM tenants WHERE id = ?', [result.id]);
    return { success: true, tenant: newTenant };
  } catch (error) {
    console.error('Erro ao criar tenant:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { success: false, error: 'Tenant ID already exists.' };
    }
    return { success: false, error: 'Failed to create tenant.' };
  }
});

// ... Adicione os outros handlers (admin-login, save-lead, etc.) usando o mesmo padrão de Promises (runQuery, getQuery, allQuery)
// Exemplo para admin-login:
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
