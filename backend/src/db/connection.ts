import { Pool } from 'pg';
import { env } from '../config/env';

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : undefined,
});

pool.on('connect', () => {
  if (env.nodeEnv !== 'production') {
    console.log('✅ Conectado ao PostgreSQL');
  }
});

pool.on('error', (error: Error) => {
  console.error('❌ Erro no pool do PostgreSQL:', error);
});
