#!/usr/bin/env node
/**
 * 🔄 Script de Reset - Limpar e Recriar Banco de Dados
 * 
 * Este script remove o banco de dados existente e permite que o Electron
 * crie um novo banco limpo na próxima execução.
 * 
 * Uso: node scripts/reset-database.js
 */

const path = require('path');
const os = require('os');
const fs = require('fs');
const readline = require('readline');

// Cores para output no console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Define o caminho do banco de dados
function getDatabasePath() {
  const platform = process.platform;
  let appDataPath;

  if (platform === 'win32') {
    appDataPath = path.join(process.env.APPDATA || '', 'InterativeLeads');
  } else if (platform === 'darwin') {
    appDataPath = path.join(os.homedir(), 'Library', 'Application Support', 'InterativeLeads');
  } else {
    appDataPath = path.join(os.homedir(), '.config', 'InterativeLeads');
  }

  return {
    dir: appDataPath,
    db: path.join(appDataPath, 'interativeleads.db')
  };
}

// Função para confirmar ação
function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.toLowerCase() === 's' || answer.toLowerCase() === 'y');
    });
  });
}

async function resetDatabase() {
  log('\n🔄 RESET DO BANCO DE DADOS - InterativeLeads', 'bright');
  log('═══════════════════════════════════════════\n', 'cyan');
  
  const { dir, db } = getDatabasePath();
  
  log(`📂 Diretório: ${dir}`, 'blue');
  log(`💾 Banco: ${db}\n`, 'blue');

  // Verifica se o banco existe
  if (!fs.existsSync(db)) {
    log('ℹ️  O banco de dados não existe ainda.', 'yellow');
    log('   Execute o aplicativo para criar um novo banco:\n', 'yellow');
    log('   npm run electron:dev\n', 'cyan');
    return;
  }

  // Informações sobre o banco atual
  const stats = fs.statSync(db);
  log(`📊 Tamanho atual: ${(stats.size / 1024).toFixed(2)} KB`, 'cyan');
  log(`📅 Última modificação: ${stats.mtime.toLocaleString()}\n`, 'cyan');

  // Aviso importante
  log('⚠️  ATENÇÃO: Esta ação irá:', 'yellow');
  log('   • Deletar TODOS os tenants cadastrados', 'red');
  log('   • Deletar TODOS os leads capturados', 'red');
  log('   • Deletar TODAS as configurações', 'red');
  log('   • Esta ação é IRREVERSÍVEL!\n', 'red');

  // Confirmação
  const confirmed = await askConfirmation('Deseja continuar? (s/N): ');

  if (!confirmed) {
    log('\n✅ Operação cancelada pelo usuário.', 'green');
    return;
  }

  try {
    // Remove o banco de dados
    fs.unlinkSync(db);
    log('\n✅ Banco de dados removido com sucesso!', 'green');
    
    // Remove arquivos temporários se existirem
    const tempFiles = [
      path.join(dir, 'interativeleads.db-shm'),
      path.join(dir, 'interativeleads.db-wal')
    ];
    
    tempFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        log(`✅ Removido: ${path.basename(file)}`, 'green');
      }
    });

    log('\n═══════════════════════════════════════════', 'cyan');
    log('🎉 RESET CONCLUÍDO!', 'green');
    log('\n📝 PRÓXIMOS PASSOS:', 'bright');
    log('   1. Execute: npm run electron:dev', 'cyan');
    log('      (Isso criará um banco novo e vazio)', 'yellow');
    log('   2. Execute: npm run seed', 'cyan');
    log('      (Isso populará o banco com tenants de teste)\n', 'yellow');

  } catch (err) {
    log(`\n❌ ERRO: ${err.message}`, 'red');
    process.exit(1);
  }
}

// Executa o reset
resetDatabase().catch(err => {
  log(`\n❌ Erro fatal: ${err.message}`, 'red');
  process.exit(1);
});

