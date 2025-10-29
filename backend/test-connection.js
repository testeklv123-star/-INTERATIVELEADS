require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

console.log('🔍 Testando conexão com PostgreSQL...');
console.log('URL:', process.env.DATABASE_URL?.replace(/:([^@]+)@/, ':***@'));

client.connect()
  .then(() => {
    console.log('✅ Conexão bem-sucedida!');
    return client.query('SELECT version()');
  })
  .then((res) => {
    console.log('📊 PostgreSQL Version:', res.rows[0].version);
    return client.end();
  })
  .then(() => {
    console.log('✅ Teste concluído!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Erro de conexão:');
    console.error('Mensagem:', err.message);
    console.error('\n💡 Possíveis causas:');
    console.error('1. Senha incorreta no .env');
    console.error('2. PostgreSQL não está rodando');
    console.error('3. Banco de dados não existe');
    process.exit(1);
  });

