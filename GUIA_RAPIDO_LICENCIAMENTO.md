# 🚀 Guia Rápido - Sistema de Licenciamento

## ⚡ Início em 5 Minutos

### 1️⃣ Preparar Backend

```bash
# Entre na pasta backend
cd backend

# Execute a migration das licenças
npm run typeorm migration:run

# Inicie o backend
npm run dev
```

**✅ Backend rodando em:** `http://localhost:3000`

---

### 2️⃣ Abrir Painel Admin

Abra no navegador:
```
admin-panel-central/index.html
```

Ou configure em um servidor web:
```bash
# Exemplo com http-server
npx http-server admin-panel-central -p 8080
```

**✅ Painel disponível em:** `http://localhost:8080`

---

### 3️⃣ Criar Primeira Licença

1. **No Painel Admin**, clique em "➕ Nova Licença"
   
2. **Preencha:**
   - Nome do Cliente: `Teste Cliente`
   - Tenant ID: `loja_tech_sp_001`
   - Tipo: `Trial`
   - Máx. Dispositivos: `1`

3. **Clique em "Criar Licença"**

4. **Copie a chave gerada:**
   ```
   WLT-A1B2-C3D4-E5F6-G7H8
   ```

---

### 4️⃣ Testar no Electron

```bash
# Na raiz do projeto
npm run electron:dev
```

**O que acontece:**
1. App detecta que não há licença válida
2. Mostra tela de ativação
3. Digite a chave copiada
4. Clique em "Ativar Licença"
5. ✅ App carrega automaticamente!

---

## 📋 Configuração do Backend (Importante!)

Edite `backend/.env`:

```env
# API URL que o app usará para validar
# EM PRODUÇÃO, configure para seu servidor
API_URL=http://localhost:3000

# Banco de dados
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=white_label_totem
```

---

## 🔧 Configuração do Painel Admin

Edite `admin-panel-central/app.js` (linha 2):

```javascript
// Para desenvolvimento local
const API_URL = 'http://localhost:3000/api';

// Para produção
const API_URL = 'https://seu-dominio.com/api';
```

---

## 🔐 Configuração do App Electron

Edite `services/licenseService.ts` (linha 22):

```typescript
constructor(apiUrl: string = 'http://localhost:3000/api') {
  // Em produção, passe a URL do seu servidor:
  // constructor(apiUrl: string = 'https://seu-dominio.com/api') {
  this.apiUrl = apiUrl;
}
```

---

## 🎯 Fluxo Completo

```
1. ADMIN cria licença no painel
   ↓
2. Copia chave (WLT-XXXX...)
   ↓
3. Envia para CLIENTE
   ↓
4. CLIENTE abre app Electron
   ↓
5. Digite chave de licença
   ↓
6. App valida online com backend
   ↓
7. Salva em cache local
   ↓
8. ✅ APP ATIVO!
```

---

## 🔄 Modo Offline

- ✅ **Primeira ativação**: Requer internet
- ✅ **Uso normal**: Valida online a cada início
- ✅ **Sem internet**: Usa cache (máx. 7 dias)
- ❌ **Após 7 dias offline**: Precisa conectar

---

## 📊 Gerenciamento de Licenças

### Ver Todas Licenças
- Acesse o painel admin
- Veja status, expiração, dispositivos

### Renovar Licença
1. Clique em "🔄" ao lado da licença
2. Digite quantos dias adicionar
3. Cliente continua usando

### Suspender Cliente
1. Clique em "⏸️" ao lado da licença
2. Confirme
3. Cliente será bloqueado na próxima validação

### Reativar Cliente
1. Clique em "▶️" ao lado da licença suspensa
2. Cliente volta a ter acesso

---

## 🚨 Problemas Comuns

### ❌ "Erro ao conectar com o servidor"
**Solução:** Verificar se backend está rodando em `http://localhost:3000`

### ❌ "Licença não encontrada"
**Solução:** Verificar se chave foi digitada corretamente

### ❌ "Limite de dispositivos atingido"
**Solução:** No painel, aumentar `max_devices` ou remover dispositivos antigos

### ❌ Painel admin não carrega dados
**Solução:** 
1. Abrir DevTools (F12)
2. Ver console para erros
3. Verificar se URL da API está correta

---

## 💡 Dicas

### Para Desenvolvimento
- Use tipo `Trial` para testes (30 dias)
- Configure `max_devices: 999` para não ter limite

### Para Produção
- Configure HTTPS no backend
- Adicione autenticação no painel admin
- Monitore logs de validação
- Configure alertas de expiração

### Para Clientes
- Forneça suporte para ativação
- Envie lembrete antes de expirar
- Tenha processo claro de renovação

---

## 📞 Checklist de Deploy

- [ ] Backend configurado e rodando
- [ ] Banco de dados criado
- [ ] Migrations executadas
- [ ] Painel admin acessível
- [ ] URL da API configurada no app
- [ ] Primeira licença criada e testada
- [ ] Modo offline testado
- [ ] Documentação entregue ao cliente

---

## 🎉 Pronto!

Agora você tem um sistema completo de licenciamento que:

✅ Valida licenças online  
✅ Funciona offline por 7 dias  
✅ Controla múltiplos clientes  
✅ Gerencia expiração  
✅ Limita dispositivos  
✅ Interface administrativa completa  

**Bom trabalho! 🚀**

