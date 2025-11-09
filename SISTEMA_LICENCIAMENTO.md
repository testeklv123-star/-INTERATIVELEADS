# 🔐 Sistema de Licenciamento Multi-Tenant

## 📋 Visão Geral

Sistema completo de gerenciamento de licenças com validação online e funcionalidade offline para o White Label Totem.

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────┐
│   PAINEL ADMIN CENTRAL (Web)            │
│   http://localhost/admin-panel-central  │
│   - Criar/Gerenciar licenças            │
│   - Ativar/Suspender clientes           │
│   - Estatísticas e monitoramento        │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
               ▼
┌─────────────────────────────────────────┐
│   BACKEND API (Node.js + TypeORM)      │
│   http://localhost:3000/api             │
│   - /licenses/validate (pública)        │
│   - /licenses (CRUD - protegida)        │
│   - Banco de dados PostgreSQL           │
└──────────────┬──────────────────────────┘
               │ API REST
               ▼
┌─────────────────────────────────────────┐
│   APP ELECTRON (Windows)                │
│   - Valida licença ao iniciar           │
│   - Funciona offline (cache 7 dias)     │
│   - Auto-renovação em background        │
└─────────────────────────────────────────┘
```

---

## 🚀 Instalação e Configuração

### 1. Backend API

```bash
cd backend

# Instalar dependências
npm install

# Configurar banco de dados
# Edite .env com suas configurações PostgreSQL

# Executar migrations
npm run typeorm migration:run

# Iniciar servidor
npm run dev
```

### 2. Painel Admin Central

```bash
# Abra no navegador
http://localhost/admin-panel-central/index.html

# Ou configure em servidor web (nginx, apache, etc)
```

### 3. App Electron

```bash
# Já está integrado automaticamente!
# Ao iniciar o app, solicitará a licença se não houver uma válida
```

---

## 📖 Como Usar

### Criar Nova Licença (Painel Admin)

1. **Acesse o Painel Admin Central**
   - Abra `admin-panel-central/index.html` no navegador

2. **Clique em "➕ Nova Licença"**

3. **Preencha os dados:**
   - **Nome do Cliente**: Nome da empresa/cliente
   - **Tenant ID**: ID único do tenant (ex: `loja_tech_sp_001`)
   - **E-mail**: E-mail do cliente (opcional)
   - **Telefone**: Telefone (opcional)
   - **Tipo de Licença**:
     - `Trial`: 30 dias grátis
     - `Mensal`: Renovação mensal
     - `Anual`: Renovação anual
     - `Vitalícia`: Sem expiração
   - **Máx. Dispositivos**: Quantos dispositivos podem usar
   - **Duração (dias)**: Customizar duração (opcional)

4. **Clique em "Criar Licença"**

5. **Copie a chave gerada:**
   ```
   WLT-XXXX-XXXX-XXXX-XXXX
   ```

6. **Envie a chave para o cliente**

---

### Ativar Licença (App Electron)

1. **Abra o App Electron**
   - Se não houver licença válida, mostrará tela de ativação

2. **Digite a chave de licença:**
   ```
   WLT-XXXX-XXXX-XXXX-XXXX
   ```

3. **Clique em "Ativar Licença"**

4. **Pronto!** O app carregará automaticamente

---

## 🔑 Endpoints da API

### Validar Licença (Pública)
```http
POST /api/licenses/validate
Content-Type: application/json

{
  "license_key": "WLT-XXXX-XXXX-XXXX-XXXX",
  "device_id": "unique-device-id"
}

Response 200:
{
  "success": true,
  "message": "Licença válida",
  "data": {
    "license_key": "WLT-...",
    "tenant_id": "loja_tech_sp_001",
    "status": "active",
    "expires_at": "2025-12-31T23:59:59Z",
    "max_devices": 1
  }
}
```

### Criar Licença
```http
POST /api/licenses
Content-Type: application/json

{
  "tenant_id": "loja_tech_sp_001",
  "client_name": "Loja Tech",
  "client_email": "contato@lojatech.com",
  "license_type": "monthly",
  "max_devices": 1
}
```

### Listar Licenças
```http
GET /api/licenses
GET /api/licenses?status=active
GET /api/licenses?tenant_id=loja_tech_sp_001
```

### Renovar Licença
```http
POST /api/licenses/:id/renew
Content-Type: application/json

{
  "duration_days": 30
}
```

### Suspender/Ativar Licença
```http
PATCH /api/licenses/:id/status
Content-Type: application/json

{
  "status": "suspended" // ou "active"
}
```

### Estatísticas
```http
GET /api/licenses/stats

Response:
{
  "success": true,
  "data": {
    "total": 10,
    "active": 8,
    "expired": 1,
    "suspended": 1,
    "inactive": 0
  }
}
```

---

## 🔄 Funcionamento Offline

### Cache Inteligente

O app mantém um cache local da licença por **7 dias**:

1. **Primeira ativação**: Requer conexão online
2. **Validações seguintes**: 
   - Tenta validar online
   - Se falhar, usa cache (máx. 7 dias)
3. **Após 7 dias offline**: Requer nova validação online

### Verificação Automática

- ✅ Valida online a cada inicialização
- ✅ Atualiza cache automaticamente
- ✅ Funciona offline dentro do período de cache
- ❌ Bloqueia após cache expirar sem validação online

---

## 🛡️ Segurança

### Proteções Implementadas

1. **Device ID único**: Cada instalação tem ID único
2. **Limite de dispositivos**: Controla quantos devices por licença
3. **Validação server-side**: Impossível burlar no cliente
4. **Expiração automática**: Licenças expiram conforme configurado
5. **Cache limitado**: Máximo 7 dias offline

### Boas Práticas

- 🔐 Use HTTPS em produção
- 🔑 Adicione autenticação no painel admin
- 📊 Monitore logs de validação
- ⚠️ Alerte clientes próximo à expiração

---

## 📊 Monitoramento

### Logs do Sistema

```typescript
// Ativação
console.log('✅ [License] Licença ativada com sucesso');

// Validação online
console.log('🔍 [License] Validando licença online...');

// Modo offline
console.log('⚠️ [License] Usando cache (offline)');

// Erro
console.error('❌ [License] Licença inválida');
```

### Métricas Importantes

- Total de licenças ativas
- Licenças próximas à expiração (< 7 dias)
- Tentativas de validação falhadas
- Dispositivos por licença

---

## 🔧 Manutenção

### Renovar Licença Manualmente

1. Acesse o painel admin
2. Encontre a licença
3. Clique em "🔄 Renovar"
4. Digite quantos dias adicionar
5. Cliente continuará usando automaticamente

### Suspender Cliente

1. Acesse o painel admin
2. Encontre a licença
3. Clique em "⏸️ Suspender"
4. App do cliente bloqueará na próxima validação

### Reativar Cliente

1. Acesse o painel admin
2. Encontre a licença suspensa
3. Clique em "▶️ Ativar"
4. Cliente poderá usar novamente

---

## 🆘 Troubleshooting

### "Não foi possível validar a licença"
✅ **Solução**: Verificar conexão com internet e se backend está rodando

### "Licença expirada"
✅ **Solução**: Renovar no painel admin

### "Limite de dispositivos atingido"
✅ **Solução**: Aumentar `max_devices` no painel ou desativar dispositivos antigos

### App não inicia (tela de licença)
✅ **Solução**: 
1. Verificar se licença existe no painel
2. Tentar com nova chave
3. Limpar cache: `localStorage.clear()` no DevTools

---

## 📱 Estrutura de Arquivos

```
white-label-totem-application/
├── backend/
│   └── src/
│       └── modules/
│           └── license/
│               ├── license.entity.ts      # Modelo do banco
│               ├── license.service.ts     # Lógica de negócio
│               ├── license.controller.ts  # Endpoints
│               └── license.routes.ts      # Rotas
│
├── admin-panel-central/
│   ├── index.html                         # Interface do painel
│   ├── style.css                          # Estilos
│   └── app.js                             # Lógica frontend
│
├── services/
│   └── licenseService.ts                  # Cliente de validação
│
├── screens/
│   └── LicenseActivation.tsx              # Tela de ativação
│
└── App.tsx                                # Integração principal
```

---

## 🎯 Próximos Passos

### Melhorias Recomendadas

1. **Autenticação no Painel Admin**
   - Login/senha para acessar painel
   - Roles (admin, viewer, etc)

2. **Notificações Automáticas**
   - E-mail antes da expiração
   - Alerta de suspensão

3. **Relatórios**
   - Exportar lista de licenças
   - Gráficos de uso

4. **Webhook/Integração**
   - Notificar sistema externo
   - Integrar com pagamento

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os logs do console
2. Consulte esta documentação
3. Entre em contato com o desenvolvedor

---

**Desenvolvido para White Label Totem System**  
Versão 1.0.0 - 2025

