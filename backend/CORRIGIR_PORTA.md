# 🔧 CORRIGIR PORTA DO SERVIDOR

## ⚠️ PROBLEMA IDENTIFICADO

O servidor está rodando na porta **3001** em vez da porta **5000** esperada.

---

## 🎯 CAUSA

Você tem uma variável `PORT=3001` no arquivo `.env` que está sobrescrevendo a porta padrão.

---

## ✅ SOLUÇÃO (3 Passos)

### Passo 1: Abrir o arquivo .env

No VS Code, abra o arquivo:
```
backend/.env
```

### Passo 2: Encontrar e Alterar a Linha

Procure por esta linha:
```env
PORT=3001
```

E **altere para**:
```env
PORT=5000
```

### Passo 3: Salvar e Reiniciar

1. Salve o arquivo (Ctrl + S)
2. Pare o servidor (Ctrl + C no terminal)
3. Inicie novamente:
   ```bash
   npm start
   ```

---

## 🔍 VERIFICAR SE FUNCIONOU

Após reiniciar, você deve ver:

```
✅ Servidor rodando em: http://localhost:5000
```

**Teste a API:**
```bash
curl http://localhost:5000/api/health
```

---

## 📝 ALTERNATIVA: Remover a Variável

Se preferir, você pode **remover completamente** a linha `PORT=3001` do arquivo `.env`.

O servidor usará automaticamente a porta 5000 (padrão definido no código).

---

## 🎯 ARQUIVO .env CORRETO

Seu arquivo `.env` deve ter algo assim:

```env
# Porta do servidor (DEVE SER 5000)
PORT=5000

# Supabase
SUPABASE_URL=sua_url_aqui
SUPABASE_ANON_KEY=sua_chave_aqui

# Outras configurações...
```

---

## ⚠️ IMPORTANTE

**NUNCA comite o arquivo `.env` no Git!**

Ele já está no `.gitignore`, mas certifique-se de não compartilhar suas credenciais.

---

## 🚀 APÓS CORRIGIR

1. **Backend rodará em:** http://localhost:5000
2. **Painel Admin funcionará** sem problemas
3. **Todas as requisições** irão para a porta correta

---

## 💡 DICA PRO

Se você quiser usar outra porta no futuro, lembre-se de atualizar também:

1. **Painel Admin:** `admin-panel/js/api.js` (linha com `API_BASE_URL`)
2. **Documentação:** Todos os guias que mencionam a porta

Mas **recomendamos manter 5000** para consistência!

---

## 🆘 AINDA COM PROBLEMAS?

### Erro: "Port 5000 already in use"

**Solução A - Matar processo na porta 5000:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <numero_do_pid> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

**Solução B - Usar outra porta temporariamente:**
```bash
PORT=5001 npm start
```

Mas lembre-se de atualizar o painel admin também!

---

## ✅ CHECKLIST

- [ ] Abri o arquivo `backend/.env`
- [ ] Encontrei a linha `PORT=3001`
- [ ] Alterei para `PORT=5000`
- [ ] Salvei o arquivo
- [ ] Parei o servidor (Ctrl + C)
- [ ] Reiniciei com `npm start`
- [ ] Verifiquei que está em localhost:5000
- [ ] Testei a API com curl ou navegador
- [ ] Testei o painel admin

---

## 🎉 PRONTO!

Agora seu servidor está rodando na porta correta! 🚀

**Porta:** 5000  
**URL:** http://localhost:5000  
**Health Check:** http://localhost:5000/api/health  
**Painel Admin:** Funcionando perfeitamente!  

