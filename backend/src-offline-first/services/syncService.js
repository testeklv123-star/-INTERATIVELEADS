/**
 * Serviço de sincronização de leads do SQLite local para Supabase
 */

const leadModelLocal = require('../models/leadModelLocal');
const leadModelSupabase = require('../models/leadModelSupabase');

let isSyncing = false;
let lastSyncTime = null;
let syncStats = {
  totalSynced: 0,
  totalErrors: 0,
  lastError: null,
};

/**
 * Sincroniza leads pendentes do banco local para o Supabase
 */
async function syncPendingLeads() {
  // Evitar múltiplas sincronizações simultâneas
  if (isSyncing) {
    console.log('⏳ Sincronização já em andamento, pulando...');
    return;
  }

  isSyncing = true;

  try {
    // Verificar conexão com Supabase
    const isConnected = await leadModelSupabase.checkConnection();
    if (!isConnected) {
      console.log('⚠️  Sem conexão com Supabase. Tentando novamente em breve...');
      isSyncing = false;
      return;
    }

    // Buscar leads pendentes
    const pendingLeads = leadModelLocal.getPendingLeads();

    if (pendingLeads.length === 0) {
      console.log('✅ Nenhum lead pendente para sincronizar');
      isSyncing = false;
      lastSyncTime = new Date();
      return;
    }

    console.log(`🔄 Iniciando sincronização de ${pendingLeads.length} lead(s)...`);

    let successCount = 0;
    let errorCount = 0;

    // Sincronizar cada lead
    for (const lead of pendingLeads) {
      try {
        // Tentar criar no Supabase
        await leadModelSupabase.createLead({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
        });

        // Marcar como sincronizado no banco local
        leadModelLocal.markAsSynced(lead.id);
        successCount++;
        syncStats.totalSynced++;

        console.log(`  ✅ Lead ${lead.id} sincronizado com sucesso`);
      } catch (error) {
        // Marcar como erro no banco local
        leadModelLocal.markAsError(lead.id, error.message);
        errorCount++;
        syncStats.totalErrors++;
        syncStats.lastError = error.message;

        console.error(`  ❌ Erro ao sincronizar lead ${lead.id}:`, error.message);
      }
    }

    console.log(
      `✅ Sincronização concluída: ${successCount} sucesso(s), ${errorCount} erro(s)`
    );

    lastSyncTime = new Date();
  } catch (error) {
    console.error('❌ Erro durante sincronização:', error);
    syncStats.lastError = error.message;
  } finally {
    isSyncing = false;
  }
}

/**
 * Retorna estatísticas de sincronização
 * @returns {Object} Estatísticas de sincronização
 */
function getSyncStats() {
  return {
    ...syncStats,
    lastSyncTime,
    isSyncing,
  };
}

/**
 * Reseta estatísticas de sincronização
 */
function resetSyncStats() {
  syncStats = {
    totalSynced: 0,
    totalErrors: 0,
    lastError: null,
  };
}

module.exports = {
  syncPendingLeads,
  getSyncStats,
  resetSyncStats,
};

