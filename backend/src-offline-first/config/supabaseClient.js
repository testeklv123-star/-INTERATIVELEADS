/**
 * Cliente Supabase para sincronização com banco de dados central
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validar variáveis de ambiente
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('❌ ERRO: Variáveis SUPABASE_URL e SUPABASE_KEY devem estar definidas no .env');
  process.exit(1);
}

// Criar cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false, // Não precisamos de sessão para operações de backend
    },
  }
);

console.log('✅ Cliente Supabase inicializado');

module.exports = supabase;

