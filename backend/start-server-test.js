// Script simples para testar se o servidor inicia
require('dotenv').config();
console.log('🔍 Testando inicialização do servidor...\n');
console.log('Variáveis de ambiente:');
console.log('- DATABASE_URL:', process.env.DATABASE_URL?.replace(/:([^@]+)@/, ':***@'));
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('\nTentando importar o servidor...\n');

try {
  require('./src/index');
  console.log('\n✅ Servidor importado com sucesso!');
} catch (err) {
  console.error('\n❌ Erro ao importar o servidor:');
  console.error(err);
  process.exit(1);
}

