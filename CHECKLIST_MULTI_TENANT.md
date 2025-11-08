# ✅ Checklist de Implementação Multi-Tenant

Use esta checklist para garantir que tudo está configurado corretamente.

---

## 📋 Pré-Requisitos

- [ ] Node.js instalado
- [ ] NPM instalado
- [ ] Acesso ao Supabase
- [ ] PowerShell ou terminal disponível

---

## 🗄️ Configuração do Banco de Dados

### Supabase

- [ ] **Acessar SQL Editor do Supabase**
  - URL: https://rtodbbiugsrhupmyarut.supabase.co
  - Menu: SQL Editor → New Query

- [ ] **Executar o script SQL**
  - Abrir: `backend/supabase-setup-multi-tenant.sql`
  - Copiar todo o conteúdo
  - Colar no SQL Editor
  - Clicar em "Run" ou pressionar F5

- [ ] **Verificar que as tabelas foram criadas**
  ```sql
  SELECT * FROM tenants;
  SELECT column_name FROM information_schema.columns WHERE table_name = 'leads';
  ```
  - Deve mostrar a tabela `tenants` com registros
  - Deve mostrar a coluna `tenant_id` em `leads`

---

## 🔑 Configuração de Variáveis de Ambiente

- [ ] **Obter chaves do Supabase**
  - Acessar: Settings → API
  - Copiar chave **anon public**
  - Copiar chave **service_role** ⚠️ (manter em segredo!)

- [ ] **Editar o arquivo `.env`**
  - Localização: `backend/.env`
  - Se não existir, criar baseado em `.env.example`

- [ ] **Adicionar/Atualizar variáveis**
  ```env
  SUPABASE_URL=https://rtodbbiugsrhupmyarut.supabase.co
  SUPABASE_KEY=sua_chave_anon_aqui
  SUPABASE_SERVICE_KEY=sua_chave_service_role_aqui
  CURRENT_TENANT_SLUG=loja-exemplo-001
  ```

- [ ] **Salvar o arquivo `.env`**

---

## 🚀 Instalação e Execução

- [ ] **Instalar dependências** (se necessário)
  ```powershell
  cd backend
  npm install
  ```

- [ ] **Iniciar o servidor**
  ```powershell
  cd backend
  npm run offline:dev
  ```

- [ ] **Verificar mensagens de inicialização**
  ```
  ✅ Banco de dados SQLite local inicializado
  ✅ Cliente Supabase inicializado
  ✅ Cliente Supabase Admin (service_role) inicializado
  ✅ Servidor rodando em: http://localhost:5000
  ✅ Endpoint de tenants: http://localhost:5000/api/tenants
  ```

---

## 🧪 Testes Básicos

### Teste 1: Health Check

- [ ] **Executar comando**
  ```powershell
  curl http://localhost:5000/health
  ```

- [ ] **Verificar resposta**
  ```json
  {
    "status": "ok",
    "message": "Servidor offline-first rodando"
  }
  ```

---

### Teste 2: Listar Tenants

- [ ] **Executar comando**
  ```powershell
  curl http://localhost:5000/api/tenants
  ```

- [ ] **Verificar que tenants são retornados**
  - Deve mostrar pelo menos os tenants de exemplo

---

### Teste 3: Criar Novo Tenant

- [ ] **Executar comando**
  ```powershell
  curl -X POST http://localhost:5000/api/tenants `
    -H "Content-Type: application/json" `
    -d '{\"name\":\"Minha Loja Teste\",\"slug\":\"minha-loja-teste\"}'
  ```

- [ ] **Verificar resposta de sucesso**
  ```json
  {
    "success": true,
    "message": "Tenant criado com sucesso"
  }
  ```

---

### Teste 4: Ver Tenant Atual

- [ ] **Executar comando**
  ```powershell
  curl http://localhost:5000/api/tenants/current
  ```

- [ ] **Verificar que retorna o tenant configurado no `.env`**
  - Deve mostrar `loja-exemplo-001` ou o slug que você configurou

---

### Teste 5: Criar Lead

- [ ] **Executar comando**
  ```powershell
  curl -X POST http://localhost:5000/api/leads `
    -H "Content-Type: application/json" `
    -d '{\"name\":\"João Silva\",\"email\":\"joao@teste.com\",\"phone\":\"11987654321\"}'
  ```

- [ ] **Verificar resposta**
  - Deve incluir `tenant_slug` no lead criado
  - Status deve ser `PENDING`

---

### Teste 6: Aguardar Sincronização

- [ ] **Aguardar 30-40 segundos**

- [ ] **Verificar logs no terminal do servidor**
  - Deve mostrar:
    ```
    🔄 Executando sincronização agendada...
    ✅ Tenant encontrado: ...
    ✅ Lead X sincronizado com sucesso
    ```

---

### Teste 7: Verificar no Supabase

- [ ] **Acessar Table Editor**
  - https://rtodbbiugsrhupmyarut.supabase.co
  - Menu: Table Editor → leads

- [ ] **Verificar que o lead foi sincronizado**
  - Deve ter `tenant_id` preenchido (UUID)

- [ ] **Executar query no SQL Editor**
  ```sql
  SELECT 
    l.name as lead_name,
    l.email,
    t.name as tenant_name
  FROM leads l
  JOIN tenants t ON l.tenant_id = t.id
  ORDER BY l.created_at DESC;
  ```

- [ ] **Verificar que o lead está vinculado ao tenant correto**

---

## 🔄 Teste Completo Multi-Tenant

### Opção 1: Manual

- [ ] **Criar tenant "Loja A"**
- [ ] **Configurar tenant atual para "Loja A"**
- [ ] **Criar lead para "Loja A"**
- [ ] **Criar tenant "Loja B"**
- [ ] **Configurar tenant atual para "Loja B"**
- [ ] **Criar lead para "Loja B"**
- [ ] **Aguardar sincronização (30s)**
- [ ] **Verificar no Supabase que cada lead está no tenant correto**

### Opção 2: Script Automatizado

- [ ] **Executar script de teste**
  ```powershell
  .\teste-multi-tenant.ps1
  ```

- [ ] **Verificar que todos os testes passaram**
  - O script faz todos os testes automaticamente

---

## 📊 Verificação de Dados

### SQLite Local

- [ ] **Ver leads no SQLite**
  ```powershell
  sqlite3 backend/data/kiosk.db "SELECT id, name, tenant_slug, sync_status FROM leads;"
  ```

- [ ] **Ver tenant atual**
  ```powershell
  sqlite3 backend/data/kiosk.db "SELECT * FROM current_tenant;"
  ```

### Supabase

- [ ] **Ver tenants**
  ```sql
  SELECT * FROM tenants ORDER BY name;
  ```

- [ ] **Ver leads com tenants**
  ```sql
  SELECT 
    l.id,
    l.name,
    l.email,
    t.name as tenant
  FROM leads l
  JOIN tenants t ON l.tenant_id = t.id
  ORDER BY l.created_at DESC;
  ```

- [ ] **Contar leads por tenant**
  ```sql
  SELECT 
    t.name as tenant,
    COUNT(l.id) as total_leads
  FROM tenants t
  LEFT JOIN leads l ON l.tenant_id = t.id
  GROUP BY t.id, t.name
  ORDER BY total_leads DESC;
  ```

---

## 🔒 Verificação de Segurança

- [ ] **Verificar que RLS está habilitado**
  ```sql
  SELECT schemaname, tablename, rowsecurity 
  FROM pg_tables 
  WHERE tablename IN ('tenants', 'leads');
  ```
  - Ambas as tabelas devem ter `rowsecurity = true`

- [ ] **Verificar políticas de segurança**
  ```sql
  SELECT * FROM pg_policies 
  WHERE tablename IN ('tenants', 'leads');
  ```
  - Deve mostrar as políticas criadas

- [ ] **Confirmar que `.env` não está no Git**
  ```powershell
  git status
  ```
  - `.env` NÃO deve aparecer na lista

---

## 📝 Documentação

- [ ] **Ler guia completo**
  - Arquivo: `GUIA_MULTI_TENANT.md`

- [ ] **Ter comandos de teste à mão**
  - Arquivo: `COMANDOS_TESTE_MULTI_TENANT.md`

- [ ] **Revisar resumo da implementação**
  - Arquivo: `RESUMO_MULTI_TENANT.md`

---

## ✅ Checklist Final

Todos os itens abaixo devem estar ✅:

- [ ] Servidor inicia sem erros
- [ ] Health check retorna OK
- [ ] Listar tenants funciona
- [ ] Criar tenant funciona
- [ ] Ver tenant atual funciona
- [ ] Criar lead funciona
- [ ] Lead tem `tenant_slug` correto
- [ ] Sincronização acontece automaticamente
- [ ] Leads aparecem no Supabase com `tenant_id`
- [ ] Relacionamento tenant ↔ lead está correto
- [ ] RLS está habilitado
- [ ] Logs estão claros e informativos

---

## 🎯 Status da Implementação

Quando todos os itens acima estiverem ✅, você pode considerar:

### ✅ IMPLEMENTAÇÃO COMPLETA E FUNCIONAL

Parabéns! Seu sistema multi-tenant está operacional! 🎉

---

## 🆘 Problemas Comuns

### ❌ "SUPABASE_SERVICE_KEY não configurado"

**Solução:** Adicionar a chave service_role no `.env`

---

### ❌ "Tenant não encontrado"

**Solução:** 
1. Executar o script SQL no Supabase
2. Ou criar o tenant via API

---

### ❌ "tenant_slug é obrigatório"

**Solução:** Configurar `CURRENT_TENANT_SLUG` no `.env`

---

### ❌ Leads não sincronizam

**Verificar:**
1. Conexão com Supabase
2. Chaves corretas no `.env`
3. Tabelas criadas no Supabase
4. Logs do servidor

---

## 📞 Próximos Passos

Após completar esta checklist:

1. [ ] Testar com dados reais
2. [ ] Criar mais tenants para clientes reais
3. [ ] Personalizar campos por tenant
4. [ ] Implementar dashboard admin
5. [ ] Preparar para produção

---

**Data de Criação:** 08/11/2025  
**Versão:** 1.0  
**Status:** ✅ Pronto para uso

---

