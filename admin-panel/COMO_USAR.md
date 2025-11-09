# 🚀 Como Usar o Painel Administrativo

## ⚡ Início Rápido (3 Passos)

### 1️⃣ Inicie o Backend
```bash
cd backend
npm start
```

> **✅ Comando Atualizado!** Agora é só `npm start` (antes era `npm run offline:dev`).

✅ Aguarde a mensagem: `Servidor Multi-Tenant rodando em http://localhost:5000`

### 2️⃣ Abra o Painel
Navegue até a pasta `admin-panel` e:

**Opção A - Simples (para testar):**
- Clique duas vezes em `index.html`

**Opção B - Profissional (recomendado):**
```bash
cd admin-panel
python -m http.server 8080
```
Depois abra: http://localhost:8080

### 3️⃣ Comece a Usar!
1. Crie seu primeiro tenant preenchendo o formulário
2. Clique em "📋 Ver Leads" para ver os contatos
3. Explore as funcionalidades! 🎉

---

## 📱 Interface do Painel

### Tela Principal: Gerenciar Tenants
- **Criar Novo Tenant:** Formulário no topo
- **Lista de Tenants:** Tabela com todos os clientes
- **Ações:** Ver Leads | Excluir

### Tela Secundária: Dashboard de Leads
- **Filtro:** Dropdown para selecionar tenant
- **Contador:** Total de leads encontrados
- **Tabela:** Lista completa com detalhes
- **Detalhes:** Botão para ver informações completas

---

## 🎯 Casos de Uso

### Criar um Novo Cliente
1. Preencha "Nome do Cliente" (ex: "Loja de Roupas Fashion")
2. O slug será gerado automaticamente: "loja-de-roupas-fashion"
3. Clique em "✅ Criar Tenant"
4. Veja a confirmação verde no canto superior direito

### Visualizar Leads de um Cliente
1. Clique no botão "Ver Leads" na linha do tenant
2. OU vá em "📋 Ver Leads" e selecione o tenant no dropdown
3. A tabela mostrará todos os leads daquele cliente

### Ver Todos os Leads (Todos os Clientes)
1. Clique em "📋 Ver Leads"
2. Selecione "📊 Todos os Leads" no dropdown
3. Veja dados agregados de todos os tenants

---

## 🔧 Solução de Problemas Comuns

### ❌ Erro: "Failed to fetch tenants"
**Causa:** Backend não está rodando
**Solução:**
```bash
cd backend
npm start
```

### ❌ Tabela fica "Carregando..." infinitamente
**Causa:** URL do backend incorreta ou CORS bloqueado
**Solução:**
1. Verifique se backend está em `http://localhost:5000`
2. Abra Console do navegador (F12) e veja o erro
3. Certifique-se que o backend aceita requisições do frontend

### ❌ "Slug deve conter apenas letras minúsculas..."
**Causa:** Você digitou caracteres inválidos no slug
**Solução:** Use apenas: `a-z`, `0-9` e `-` (hífen)
- ✅ Correto: `empresa-abc`, `loja-123`
- ❌ Errado: `Empresa ABC`, `loja_teste`, `ação`

### ❌ Não consigo deletar um tenant
**Causa:** Proteção contra exclusão acidental
**Solução:** 
1. Clique em "Excluir"
2. Confirme na caixa de diálogo
3. ⚠️ CUIDADO: Não pode desfazer!

---

## 💡 Dicas Profissionais

### 🎨 Personalize o Visual
- Edite `css/style.css` para mudar cores
- Procure por "bg-blue-600" no HTML e troque para "bg-green-600" (ou outra cor)

### 🔍 Debug de Problemas
1. Sempre abra o Console (F12)
2. Vá na aba "Console" para ver erros JavaScript
3. Vá na aba "Network" para ver requisições HTTP

### ⚡ Atalhos Úteis
- `F5` - Recarregar página
- `Ctrl + Shift + I` - Abrir DevTools
- `Ctrl + Shift + C` - Inspecionar elemento

### 📊 Monitore as Requisições
No Chrome/Firefox:
1. Abra DevTools (F12)
2. Vá em "Network"
3. Veja todas as requisições para o backend
4. Clique em uma requisição para ver detalhes

---

## 🎓 Para Aprender Mais

### Entenda o Código
- **Comece por:** `js/api.js` (mais simples)
- **Depois veja:** `js/app.js` (mais complexo)
- **Por último:** `index.html` (estrutura)

### Conceitos Importantes
- **Fetch API:** Como fazer requisições HTTP
- **Async/Await:** Como trabalhar com operações assíncronas
- **DOM Manipulation:** Como atualizar a página dinamicamente
- **Event Listeners:** Como responder a cliques e inputs

### Próximos Estudos
1. Adicione um botão de "Editar" para tenants
2. Implemente busca/filtro na tabela de leads
3. Adicione gráficos usando Chart.js
4. Crie um modal para detalhes completos do lead

---

## 📞 Precisa de Ajuda?

### Antes de Pedir Ajuda:
1. ✅ Verifique o Console do navegador (F12)
2. ✅ Confirme que o backend está rodando
3. ✅ Leia a mensagem de erro completa
4. ✅ Tente recarregar a página (F5)

### Como Reportar um Erro:
1. Descreva o que você estava fazendo
2. Copie a mensagem de erro do Console
3. Tire um screenshot da tela
4. Informe qual navegador está usando

---

## ✅ Checklist de Funcionalidades

- [x] Criar tenant
- [x] Listar tenants
- [x] Excluir tenant
- [x] Ver leads de um tenant
- [x] Ver todos os leads
- [x] Filtrar por tenant
- [x] Contador de leads
- [x] Mensagens de sucesso/erro
- [x] Loading states
- [x] Auto-geração de slug
- [x] Validação de formulário
- [x] Design responsivo

---

## 🎉 Pronto para Começar!

Agora você tem um painel administrativo completo e funcional!

**Próximos passos sugeridos:**
1. Teste criando 2-3 tenants de exemplo
2. Veja como os leads aparecem no dashboard
3. Explore o código e entenda como funciona
4. Faça pequenas modificações para aprender

**Divirta-se e bom trabalho!** 🚀

