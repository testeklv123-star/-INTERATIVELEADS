# 📝 Notas Técnicas do Painel Administrativo

## ✅ Endpoints Disponíveis (Já Funcionam)

### Tenants
- `GET /api/tenants` - Listar todos os tenants ✅
- `POST /api/tenants` - Criar novo tenant ✅
- `GET /api/tenants/:slug` - Buscar tenant específico ✅

### Leads
- `GET /api/leads` - Listar todos os leads ✅
- `POST /api/leads` - Criar novo lead ✅
- `GET /api/leads/stats` - Estatísticas de sincronização ✅

## ⚠️ Funcionalidades que Precisam de Backend (Futuro)

### 1. Deletar Tenant
**Status:** Interface pronta, mas backend não implementado

**O que fazer:**
No arquivo `backend/src-offline-first/controllers/tenantController.js`, adicione:

```javascript
// Deletar um tenant
async deleteTenant(req, res) {
  try {
    const { slug } = req.params;
    
    // Lógica para deletar do banco
    // CUIDADO: Também deletar todos os leads associados
    
    res.json({ 
      success: true, 
      message: `Tenant ${slug} deletado com sucesso` 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

E adicione a rota em `tenantRoutes.js`:
```javascript
router.delete('/:slug', tenantController.deleteTenant);
```

### 2. Atualizar Tenant
**Status:** Interface pronta, mas backend não implementado

**O que fazer:**
No controller, adicione:

```javascript
// Atualizar um tenant
async updateTenant(req, res) {
  try {
    const { slug } = req.params;
    const { name, newSlug } = req.body;
    
    // Lógica para atualizar no banco
    
    res.json({ 
      success: true, 
      tenant: { name, slug: newSlug || slug } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

E adicione a rota:
```javascript
router.put('/:slug', tenantController.updateTenant);
```

### 3. Filtrar Leads por Tenant
**Status:** Interface pronta, mas backend pode precisar de ajuste

**Como funciona atualmente:**
O painel envia: `GET /api/leads?tenant=empresa-abc`

**Verifique no backend:**
No arquivo `leadController.js`, o método `getAllLeads` precisa aceitar o query parameter `tenant`:

```javascript
async getAllLeads(req, res) {
  try {
    const { tenant } = req.query; // Pegar parâmetro da URL
    
    let leads;
    if (tenant) {
      // Filtrar por tenant
      leads = await Lead.findAll({ where: { tenant_slug: tenant } });
    } else {
      // Retornar todos
      leads = await Lead.findAll();
    }
    
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## 🔧 Configuração de CORS

Se você abrir o painel diretamente no navegador (sem servidor), pode ter problemas de CORS.

**Solução:** No arquivo `backend/src-offline-first/server.js`, certifique-se de ter:

```javascript
const cors = require('cors');

app.use(cors({
  origin: '*', // Em produção, especifique o domínio exato
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
```

## 📊 Estrutura de Dados Esperada

### Tenant
```json
{
  "id": 1,
  "name": "Empresa ABC",
  "slug": "empresa-abc",
  "created_at": "2025-01-15T10:30:00Z"
}
```

### Lead
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "(11) 98765-4321",
  "tenant_slug": "empresa-abc",
  "created_at": "2025-01-15T10:30:00Z",
  "synced": false
}
```

## 🎨 Personalização

### Alterar Cores do Tema

No arquivo `index.html`, procure por:
- `bg-blue-600` → cor de fundo azul
- `text-blue-600` → cor de texto azul
- `border-blue-500` → cor de borda azul

Substitua por outras cores do Tailwind:
- `green` → Verde
- `purple` → Roxo
- `red` → Vermelho
- `indigo` → Índigo
- `pink` → Rosa

Exemplo:
```html
<!-- De -->
<button class="bg-blue-600 text-white">

<!-- Para -->
<button class="bg-purple-600 text-white">
```

### Adicionar Logo da Empresa

No `index.html`, dentro do `<header>`, adicione:

```html
<div class="flex items-center space-x-3">
  <img src="logo.png" alt="Logo" class="h-10 w-10">
  <h1 class="text-3xl font-bold">InterativeLeads</h1>
</div>
```

## 🚀 Melhorias Futuras Sugeridas

### Fácil (1-2 horas)
- [ ] Adicionar paginação na lista de leads
- [ ] Implementar busca/filtro por nome ou email
- [ ] Adicionar botão de exportar CSV
- [ ] Mostrar contador de leads por tenant

### Médio (3-5 horas)
- [ ] Adicionar modal de detalhes completos do lead
- [ ] Implementar edição de tenant
- [ ] Adicionar confirmação antes de deletar
- [ ] Criar dashboard com gráficos (usar Chart.js)

### Avançado (1-2 dias)
- [ ] Sistema de login com JWT
- [ ] Permissões de usuário (admin vs. visualizador)
- [ ] Notificações em tempo real (WebSocket)
- [ ] Exportação em diferentes formatos (CSV, Excel, PDF)
- [ ] Dark Mode
- [ ] Multi-idioma (i18n)

## 🐛 Debugging

### Como ver as requisições HTTP

**No Chrome/Firefox:**
1. Pressione F12
2. Vá para a aba "Network"
3. Recarregue a página
4. Veja todas as requisições para `/api/...`

**O que observar:**
- Status Code: 200 = sucesso, 404 = não encontrado, 500 = erro no servidor
- Response: A resposta do servidor (dados JSON)
- Request Headers: Cabeçalhos enviados
- Payload: Dados enviados (em POST/PUT)

### Erros Comuns e Soluções

**Erro:** `TypeError: Cannot read property 'map' of undefined`
- **Causa:** O backend retornou `null` ou `undefined` em vez de um array
- **Solução:** Adicione verificação: `const items = data || [];`

**Erro:** `Failed to fetch`
- **Causa:** Backend offline ou CORS bloqueado
- **Solução:** Verifique se backend está rodando e configure CORS

**Erro:** `Unexpected end of JSON input`
- **Causa:** Resposta vazia ou não-JSON do backend
- **Solução:** Verifique a resposta no Network tab

## 📚 Recursos de Aprendizado

### JavaScript Moderno
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [JavaScript.info - Async/Await](https://javascript.info/async-await)

### Tailwind CSS
- [Documentação Oficial](https://tailwindcss.com/docs)
- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

### APIs REST
- [HTTP Status Codes](https://httpstatuses.com/)
- [REST API Tutorial](https://restfulapi.net/)

## 🎓 Exercícios Práticos

Para consolidar seu aprendizado, tente implementar:

1. **Contador de Leads por Tenant**
   - Adicione uma coluna na tabela de tenants
   - Mostre quantos leads cada tenant tem

2. **Busca em Tempo Real**
   - Adicione um input acima da tabela de leads
   - Filtre a tabela conforme o usuário digita

3. **Notificação de Sucesso Melhorada**
   - Adicione ícones às notificações
   - Crie diferentes tipos (sucesso, erro, aviso, info)

4. **Modal de Confirmação Customizado**
   - Substitua o `confirm()` nativo por um modal bonito
   - Use Tailwind para estilizar

## 🔐 Segurança (Futuro)

⚠️ **IMPORTANTE:** Este painel NÃO tem autenticação!

Para produção, você DEVE adicionar:

1. **Autenticação:**
   - Login com usuário e senha
   - JWT (JSON Web Tokens)
   - Sessões seguras

2. **Autorização:**
   - Diferentes níveis de acesso
   - Admin vs. Visualizador
   - Permissões por tenant

3. **Validação:**
   - Validação de entrada no backend
   - Sanitização de dados
   - Proteção contra SQL Injection

4. **HTTPS:**
   - Em produção, SEMPRE use HTTPS
   - Nunca envie senhas em HTTP

## 📞 Próximos Passos

1. ✅ Teste o painel com o backend rodando
2. ✅ Crie alguns tenants de exemplo
3. ✅ Veja como os leads aparecem
4. 📝 Implemente as melhorias sugeridas
5. 🔐 Adicione autenticação antes de produção
6. 🚀 Deploy em servidor (quando pronto)

---

**Criado com ❤️ para ajudar no seu aprendizado!**

