# 🏗️ Como Gerar o .EXE do InterativeLeads

## ⚠️ IMPORTANTE: Privilégios de Administrador

O `electron-builder` precisa de **privilégios de administrador** no Windows para gerar o instalador.

---

## ✅ **MÉTODO 1: PowerShell como Administrador (Recomendado)**

### Passo a Passo:

1. **Feche o Cursor/VS Code atual**

2. **Abra o PowerShell como Administrador:**
   - Pressione `Win + X`
   - Clique em "Windows PowerShell (Admin)" ou "Terminal (Admin)"
   - Ou: Pesquise "PowerShell" → Clique com botão direito → "Executar como administrador"

3. **Navegue até a pasta do projeto:**
   ```powershell
   cd "C:\Users\User\Desktop\projetos\white-label-totem-application"
   ```

4. **Execute o comando de build:**
   ```powershell
   npm run electron:build:win
   ```

5. **Aguarde o build terminar** (pode demorar alguns minutos na primeira vez)

6. **Resultado:**
   ```
   release/InterativeLeads-1.0.0-Portable.exe
   ```

---

## ✅ **MÉTODO 2: Habilitar Modo Desenvolvedor do Windows**

Este método permite criar symbolic links sem ser administrador:

1. **Abrir Configurações do Windows:**
   - Pressione `Win + I`
   - Vá em **"Atualização e Segurança"**

2. **Ativar Modo Desenvolvedor:**
   - Clique em **"Para Desenvolvedores"** no menu lateral
   - Ative **"Modo de Desenvolvedor"**
   - Aceite o aviso

3. **Reinicie o terminal normal:**
   ```bash
   npm run electron:build:win
   ```

---

## ✅ **MÉTODO 3: Usar o App Descompactado (Sem Instalador)**

Se você não conseguir gerar o `.exe` por enquanto, pode usar a versão descompactada:

1. **Gerar apenas o build:**
   ```bash
   npm run build
   npm run electron
   ```

2. **Copiar a pasta:**
   ```
   release/win-unpacked/
   ```

3. **Dentro há o arquivo:**
   ```
   InterativeLeads.exe
   ```

   Este `.exe` funciona perfeitamente, mas precisa da pasta inteira para rodar.

---

## 📦 **O que será gerado:**

Dependendo da configuração, você terá:

### **Versão Portable** (atual):
```
release/
└── InterativeLeads-1.0.0-Portable.exe  (≈150 MB)
```

✅ **Vantagens:**
- Arquivo único
- Não precisa instalação
- Pode rodar de pen drive
- Ideal para testes

### **Versão Instalador (futura):**

Para gerar instalador completo, mude em `package.json`:

```json
"win": {
  "target": ["nsis"],  // Ao invés de "portable"
  ...
}
```

Resultado:
```
release/
└── InterativeLeads-Setup-1.0.0.exe (≈150 MB)
```

---

## 🐛 **Troubleshooting**

### Erro: "Cannot create symbolic link"
**Solução:** Execute como Administrador (Método 1)

### Erro: "EPERM: operation not permitted"
**Solução:** Feche o Cursor/VS Code e execute PowerShell como Admin

### Build demora muito
**Normal:** Primeira vez pode levar 5-10 minutos (baixa dependências do Electron)

### "better-sqlite3" erro de compilação
```bash
# Execute como Admin:
npm rebuild better-sqlite3
```

---

## ⚡ **Comando Completo (Como Admin):**

```powershell
# Abra PowerShell como Administrador
cd "C:\Users\User\Desktop\projetos\white-label-totem-application"
npm run electron:build:win
```

**Aguarde a mensagem:**
```
✓ Built in X.XXs
• built       InterativeLeads-1.0.0-Portable.exe
```

**Arquivo final:**
```
release\InterativeLeads-1.0.0-Portable.exe
```

---

## ✅ **Testar o .exe gerado:**

1. Navegue até a pasta `release/`
2. Dê duplo clique em `InterativeLeads-1.0.0-Portable.exe`
3. O app abrirá em fullscreen
4. Digite o tenant ID: `loja_tech_sp_001`
5. Pronto!

---

## 📋 **Checklist Final:**

- [ ] PowerShell aberto como Administrador
- [ ] Navegou até a pasta do projeto
- [ ] Executou `npm run electron:build:win`
- [ ] Build concluído com sucesso
- [ ] Arquivo `.exe` apareceu em `release/`
- [ ] Testou o `.exe` e funciona

---

## 🎉 **Sucesso!**

Agora você tem o **InterativeLeads.exe** pronto para distribuir para totens!

**Próximos passos:**
- Copiar para pen drive
- Instalar em totens
- Testar captura de leads
- Exportar dados do banco local

---

<div align="center">
  <strong>📦 Geração de Instalador Completa!</strong>
</div>

