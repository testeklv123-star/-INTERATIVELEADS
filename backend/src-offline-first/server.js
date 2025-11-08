/**
 * Servidor Express para aplicação offline-first
 * Captura leads localmente e sincroniza com Supabase quando há conexão
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

// Importar rotas
const leadRoutes = require('./routes/leadRoutes');
const syncRoutes = require('./routes/syncRoutes');
const tenantRoutes = require('./routes/tenantRoutes');

// Importar serviço de sincronização
const { syncPendingLeads } = require('./services/syncService');

// Criar aplicação Express
const app = express();

// Configurar porta
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Permitir requisições de qualquer origem
app.use(express.json()); // Parser de JSON
app.use(express.urlencoded({ extended: true })); // Parser de URL encoded

// Middleware de log
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor offline-first rodando',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/leads', leadRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/tenants', tenantRoutes);

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: err.message,
  });
});

// Configurar job de sincronização com node-cron
const syncInterval = process.env.SYNC_INTERVAL_SECONDS || 30;
const cronExpression = `*/${syncInterval} * * * * *`; // A cada X segundos

console.log(`⏰ Configurando sincronização automática a cada ${syncInterval} segundos`);

cron.schedule(cronExpression, () => {
  console.log('\n🔄 Executando sincronização agendada...');
  syncPendingLeads().catch((err) => {
    console.error('❌ Erro na sincronização agendada:', err);
  });
});

// Executar sincronização inicial após 5 segundos
setTimeout(() => {
  console.log('\n🔄 Executando sincronização inicial...');
  syncPendingLeads().catch((err) => {
    console.error('❌ Erro na sincronização inicial:', err);
  });
}, 5000);

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║   🚀 Servidor Offline-First InterativeLeads               ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\n✅ Servidor rodando em: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`✅ Endpoint de leads: http://localhost:${PORT}/api/leads`);
  console.log(`✅ Endpoint de tenants: http://localhost:${PORT}/api/tenants`);
  console.log(`✅ Sincronização automática: a cada ${syncInterval} segundos\n`);
});

// Tratamento de sinais de encerramento
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Encerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n⏹️  Encerrando servidor...');
  process.exit(0);
});

