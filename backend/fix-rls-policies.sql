-- =========================================
-- CORRIGIR POLÍTICAS RLS - EXECUTE NO SUPABASE
-- =========================================
-- Este script corrige as políticas de Row Level Security
-- para permitir que os totems (usando chave anon) possam ler tenants

-- 1. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Permitir SELECT de tenants para service role" ON tenants;
DROP POLICY IF EXISTS "Permitir INSERT de tenants para service role" ON tenants;
DROP POLICY IF EXISTS "Permitir SELECT de leads" ON leads;
DROP POLICY IF EXISTS "Permitir INSERT de leads para totems" ON leads;

-- 2. Criar política que permite leitura de tenants para TODOS (incluindo anon)
CREATE POLICY "Permitir leitura de tenants para todos"
ON tenants FOR SELECT
TO anon, authenticated, service_role
USING (true);

-- 3. Criar política que permite criação de tenants apenas para service_role
CREATE POLICY "Permitir criacao de tenants para service_role"
ON tenants FOR INSERT
TO service_role
WITH CHECK (true);

-- 4. Criar política que permite inserir leads (anon pode inserir)
CREATE POLICY "Permitir inserir leads"
ON leads FOR INSERT
TO anon, authenticated, service_role
WITH CHECK (true);

-- 5. Criar política que permite ler leads
CREATE POLICY "Permitir ler leads"
ON leads FOR SELECT
TO anon, authenticated, service_role
USING (true);

-- 6. Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename IN ('tenants', 'leads')
ORDER BY tablename, policyname;

-- ✅ Pronto! Agora os totems podem ler tenants e inserir leads

