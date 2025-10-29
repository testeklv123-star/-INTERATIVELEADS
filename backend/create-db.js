require('dotenv').config();
const { Client } = require('pg');

// Conectar ao banco padrão 'postgres' para criar o banco
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Nenus123',
  database: 'postgres' // Conecta ao banco padrão
});

console.log('🔧 Criando banco de dados interativeleads...');

client.connect()
  .then(() => {
    console.log('✅ Conectado ao PostgreSQL');
    // Verificar se o banco já existe
    return client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'interativeleads'"
    );
  })
  .then((res) => {
    if (res.rows.length > 0) {
      console.log('ℹ️  Banco de dados já existe!');
      return null;
    } else {
      // Criar o banco
      return client.query('CREATE DATABASE interativeleads');
    }
  })
  .then((res) => {
    if (res !== null) {
      console.log('✅ Banco de dados "interativeleads" criado com sucesso!');
    }
    return client.end();
  })
  .then(() => {
    console.log('✅ Processo concluído!');
    console.log('\n📋 Próximo passo: Execute "npm run migration:run"');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  });

