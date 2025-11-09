// Script de teste rápido para verificar se o servidor inicia
console.log('🔍 Testando inicialização do servidor...\n');

try {
  // Testar dotenv
  require('dotenv').config();
  console.log('✅ dotenv carregado');
  console.log(`   PORT configurada: ${process.env.PORT || 'não definida (usará 5000)'}`);
  
  // Testar express
  const express = require('express');
  console.log('✅ express carregado');
  
  // Testar cors
  const cors = require('cors');
  console.log('✅ cors carregado');
  
  // Testar node-cron
  const cron = require('node-cron');
  console.log('✅ node-cron carregado');
  
  // Testar rotas
  console.log('\n🔍 Testando imports de rotas...');
  const leadRoutes = require('./src-offline-first/routes/leadRoutes');
  console.log('✅ leadRoutes carregado');
  
  const syncRoutes = require('./src-offline-first/routes/syncRoutes');
  console.log('✅ syncRoutes carregado');
  
  const tenantRoutes = require('./src-offline-first/routes/tenantRoutes');
  console.log('✅ tenantRoutes carregado');
  
  // Testar serviços
  console.log('\n🔍 Testando imports de serviços...');
  const { syncPendingLeads } = require('./src-offline-first/services/syncService');
  console.log('✅ syncService carregado');
  
  console.log('\n✅ TODOS OS IMPORTS FUNCIONARAM!');
  console.log('\n🚀 Agora testando servidor real...\n');
  
  // Criar app básico
  const app = express();
  const PORT = process.env.PORT || 5000;
  
  app.use(cors());
  app.use(express.json());
  
  app.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor de teste funcionando!' });
  });
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║   ✅ SERVIDOR DE TESTE INICIADO COM SUCESSO!              ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`\n✅ Porta: ${PORT}`);
    console.log(`✅ URL: http://localhost:${PORT}/test`);
    console.log('\n💡 Pressione Ctrl+C para parar\n');
  });
  
} catch (error) {
  console.error('\n❌ ERRO ENCONTRADO:');
  console.error(error);
  process.exit(1);
}

