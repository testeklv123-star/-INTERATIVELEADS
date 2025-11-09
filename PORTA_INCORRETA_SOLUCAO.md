# 🔴 PROBLEMA: Servidor Rodando na Porta Errada

## ⚠️ SITUAÇÃO ATUAL

- **Esperado:** Porta 5000
- **Atual:** Porta 3001
- **Causa:** Variável `PORT=3001` no arquivo `.env`

---

## ✅ SOLUÇÃO RÁPIDA (30 segundos)

### Passo 1: Abrir o arquivo
```
Abra: backend/.env
```

### Passo 2: Encontrar esta linha
```env
PORT=3001
```

### Passo 3: Mudar para
```env
PORT=5000
```

### Passo 4: Salvar e reiniciar
```bash
# Pare o servidor (Ctrl + C)
# Depois:
cd backend
npm start
```

---

## 🔍 COMO VERIFICAR

Após reiniciar, você DEVE ver:

```
✅ Servidor rodando em: http://localhost:5000
```

**Teste no navegador:**
```
http://localhost:5000/api/health
```

Deve retornar:
```json
{
  "status": "ok",
  "message": "Servidor offline-first rodando"
}
```

---

## 📝 SEU ARQUIVO .env DEVE TER

```env
# Porta correta
PORT=5000

# Suas outras configurações do Supabase
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

---

## 🎯 POR QUE PORTA 5000?

1. **Painel Admin configurado** para usar porta 5000
2. **Documentação toda** referencia porta 5000
3. **Padrão do projeto** é porta 5000
4. **Evita conflitos** com outras aplicações

---

## ⚠️ SE NÃO CONSEGUIR EDITAR O .env

O arquivo `.env` pode estar oculto. Para vê-lo:

### No VS Code:
1. Vá em File → Open File
2. Digite o caminho completo: `backend/.env`
3. Edite e salve

### No Windows Explorer:
1. Vá na pasta backend
2. Ative "Mostrar arquivos ocultos"
3. Procure por `.env`
4. Abra com Notepad
5. Mude `PORT=3001` para `PORT=5000`
6. Salve

---

## 🚨 IMPORTANTE

**Depois de mudar:**

1. ✅ Pare o servidor (Ctrl + C)
2. ✅ Reinicie com `npm start`
3. ✅ Verifique a porta no terminal
4. ✅ Teste a API
5. ✅ Teste o painel admin

**Não adianta só mudar sem reiniciar!**

---

## 💡 ALTERNATIVA: Forçar Porta via Comando

Se não conseguir editar o `.env`, force a porta:

```bash
# Windows (PowerShell)
$env:PORT=5000; npm start

# Windows (CMD)
set PORT=5000 && npm start

# Linux/Mac
PORT=5000 npm start
```

Mas isso é **temporário**. O ideal é corrigir o `.env`!

---

## 📚 DOCUMENTOS RELACIONADOS

- 📄 `backend/CORRIGIR_PORTA.md` - Guia detalhado
- 📄 `backend/env.example.txt` - Exemplo de configuração
- 📄 `backend/SERVIDOR_CORRETO.md` - Info sobre o servidor

---

## ✅ CHECKLIST

- [ ] Abri o arquivo `backend/.env`
- [ ] Encontrei `PORT=3001`
- [ ] Mudei para `PORT=5000`
- [ ] Salvei o arquivo
- [ ] Parei o servidor (Ctrl + C)
- [ ] Reiniciei: `npm start`
- [ ] Vi mensagem com porta 5000
- [ ] Testei: http://localhost:5000/api/health
- [ ] Painel admin funcionando!

---

## 🎉 APÓS CORRIGIR

✅ Backend: http://localhost:5000  
✅ API Health: http://localhost:5000/api/health  
✅ API Tenants: http://localhost:5000/api/tenants  
✅ API Leads: http://localhost:5000/api/leads  
✅ Painel Admin: Funcionando perfeitamente!  

---

<div align="center">

# 🔧 CORRIJA AGORA!

**1. Abra:** `backend/.env`  
**2. Mude:** `PORT=3001` → `PORT=5000`  
**3. Salve e reinicie!**

**Tempo:** 30 segundos  
**Dificuldade:** Muito fácil  
**Resultado:** Tudo funcionando! ✨

</div>

