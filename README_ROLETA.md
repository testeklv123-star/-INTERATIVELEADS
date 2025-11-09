# 🎰 Roleta de Prêmios - InterativeLeads

> Sistema completo de gamificação com roleta interativa para captação de leads

[![Status](https://img.shields.io/badge/Status-Pronto-success)](.)
[![Versão](https://img.shields.io/badge/Versão-1.0.0-blue)](.)
[![Electron](https://img.shields.io/badge/Electron-39.1-47848F)](.)
[![React](https://img.shields.io/badge/React-19.2-61DAFB)](.)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)](.)

---

## 🎯 O Que É?

A **Roleta de Prêmios** é uma funcionalidade de gamificação que recompensa usuários após preencherem o formulário de leads. Após o cadastro, uma roleta animada aparece e o usuário gira para descobrir qual prêmio ganhou.

### ✨ Características Principais

- 🎰 **Roleta Animada** - Animação suave de 5 segundos
- 🎲 **Sistema de Probabilidades** - Controle total sobre chances de cada prêmio
- 💾 **Persistência Completa** - Todos os dados salvos no SQLite
- 🎨 **Totalmente Customizável** - Prêmios, cores, imagens, probabilidades
- 📊 **Rastreamento Completo** - Histórico de todos os giros
- 🔒 **Offline-First** - Funciona 100% offline no Electron
- 📱 **Responsivo** - Adapta-se a diferentes resoluções

---

## 🚀 Início Rápido

### 1. Instalar
```bash
npm install react-roulette-pro
```

### 2. Iniciar
```bash
npm run electron:dev
```

### 3. Testar
1. Clique na tela inicial
2. Selecione um jogo
3. Preencha o formulário
4. **🎰 A roleta aparece!**
5. Clique em "GIRAR ROLETA"
6. Veja o resultado

---

## 📸 Preview

```
┌─────────────────────────────────────┐
│       🎰 Roleta de Prêmios         │
│   Clique no botão para girar!      │
├─────────────────────────────────────┤
│                                     │
│          [Roleta Animada]           │
│                                     │
│        ┌─────────────────┐          │
│        │  GIRAR ROLETA   │          │
│        └─────────────────┘          │
│                                     │
└─────────────────────────────────────┘

Após girar:

┌─────────────────────────────────────┐
│          🎉 Parabéns!              │
│                                     │
│        Você ganhou:                 │
│                                     │
│      [Imagem do Prêmio]            │
│                                     │
│       Cupom 10% OFF                │
│                                     │
│        ┌─────────────────┐          │
│        │    CONTINUAR    │          │
│        └─────────────────┘          │
└─────────────────────────────────────┘
```

---

## 📦 O Que Foi Implementado

### Backend (Electron)
```
electron/
├── rouletteService.js    ← Lógica da roleta
├── database.js           ← Inicialização
└── ipc-handlers.js       ← Comunicação IPC
```

### Frontend (React)
```
components/games/
└── Roulette.tsx          ← Componente visual

screens/
└── LeadForm.tsx          ← Integração

services/
└── electronService.ts    ← Métodos IPC
```

### Banco de Dados (SQLite)
```sql
roulette_prizes           ← Prêmios disponíveis
lead_spins                ← Giros realizados
```

---

## 🎨 Personalização

### Alterar Prêmios

**Arquivo:** `electron/rouletteService.js`

```javascript
const defaultPrizes = [
  {
    name: 'Cupom 10% OFF',
    image_url: '/prizes/cupom-10.png',
    color: '#FF6B35',
    probability: 35
  },
  // ... adicione mais prêmios
];
```

### Alterar Tempo de Giro

**Arquivo:** `components/games/Roulette.tsx`

```typescript
<RouletteWheel
  spinningTime={5}  // ← Segundos
  // ...
/>
```

---

## 📊 Prêmios Padrão

| Prêmio | Probabilidade | Cor |
|--------|---------------|-----|
| Cupom 10% OFF | 35% | 🟠 |
| Brinde Exclusivo | 30% | 🔵 |
| Cupom 20% OFF | 20% | 🟡 |
| Produto Premium | 10% | 🟢 |
| Super Prêmio | 5% | 🔴 |

---

## 🔍 Consultas SQL

### Ver todos os giros
```sql
SELECT 
  l.name,
  l.email,
  rp.name as prize,
  ls.created_at
FROM lead_spins ls
JOIN leads l ON ls.lead_id = l.id
JOIN roulette_prizes rp ON ls.prize_id = rp.id
ORDER BY ls.created_at DESC;
```

### Estatísticas
```sql
SELECT 
  rp.name,
  COUNT(ls.id) as vezes_ganho,
  rp.probability as prob_esperada
FROM roulette_prizes rp
LEFT JOIN lead_spins ls ON rp.id = ls.prize_id
GROUP BY rp.id;
```

---

## 🐛 Problemas Comuns

### Roleta não aparece
✅ Confirme que está no Electron (não no navegador)  
✅ Abra o console (F12) e procure por erros  
✅ Verifique se os prêmios foram carregados

### Prêmios não aparecem
✅ Delete o banco de dados  
✅ Reinicie o aplicativo  
✅ Os prêmios serão criados automaticamente

### Animação trava
✅ Feche outros aplicativos pesados  
✅ Reduza o tempo de animação

---

## 📚 Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| [GUIA_RAPIDO_ROLETA.md](GUIA_RAPIDO_ROLETA.md) | Início rápido (5 min) |
| [RESUMO_ROLETA.md](RESUMO_ROLETA.md) | Visão geral executiva |
| [ROLETA_PREMIOS_IMPLEMENTACAO.md](ROLETA_PREMIOS_IMPLEMENTACAO.md) | Documentação técnica completa |
| [EXEMPLO_PREMIOS_CUSTOMIZADOS.md](EXEMPLO_PREMIOS_CUSTOMIZADOS.md) | Guia de personalização |
| [TESTE_ROLETA.md](TESTE_ROLETA.md) | Guia de testes |
| [INDICE_ROLETA.md](INDICE_ROLETA.md) | Índice de navegação |

---

## 🎯 Fluxo Completo

```
Formulário → Lead Salvo → Prêmio Sorteado → 🎰 Roleta → Resultado → Jogo
```

**Tempo:** ~10 segundos por usuário

---

## 🛠️ Tecnologias

- **Frontend:** React 19.2 + TypeScript 5.8
- **UI:** react-roulette-pro + Tailwind CSS
- **Backend:** Node.js + Electron 39.1
- **Database:** SQLite3
- **IPC:** Electron IPC Handlers

---

## ✅ Checklist

- [x] Biblioteca instalada
- [x] Serviço de roleta criado
- [x] Tabelas no banco criadas
- [x] Prêmios padrão inseridos
- [x] Handlers IPC adicionados
- [x] Componente React criado
- [x] Integração com formulário
- [x] Documentação completa
- [x] Testes realizados

**Status:** ✅ **PRONTO PARA USO!**

---

## 📈 Próximos Passos (Opcional)

### Curto Prazo
- [ ] Adicionar sons
- [ ] Melhorar imagens
- [ ] Coletar feedback

### Médio Prazo
- [ ] Painel admin
- [ ] Dashboard de estatísticas
- [ ] Controle de estoque

### Longo Prazo
- [ ] QR Code para resgate
- [ ] Integração CRM
- [ ] Multi-idioma

---

## 💡 Dicas

1. **Sempre teste no Electron** (não no navegador)
2. **Delete o banco para resetar** dados de teste
3. **Consulte os logs** (F12) em caso de erro
4. **Probabilidades devem somar 100**
5. **Use imagens de 150x150px**

---

## 📞 Suporte

**Precisa de ajuda?**

1. Consulte a [documentação completa](INDICE_ROLETA.md)
2. Verifique os [problemas comuns](GUIA_RAPIDO_ROLETA.md#-problemas-comuns)
3. Revise os [logs do console](TESTE_ROLETA.md#-teste-5-console-e-logs)
4. Teste o [banco de dados](GUIA_RAPIDO_ROLETA.md#-verificar-se-funcionou)

---

## 📄 Licença

Este projeto faz parte do **InterativeLeads** - Sistema Profissional de Captação de Leads.

---

## 👨‍💻 Desenvolvido Por

**Engenheiro Sênior Especialista em Electron e React**

Data: 09/11/2025  
Versão: 1.0.0

---

## 🎉 Pronto!

A Roleta de Prêmios está funcionando e pronta para uso!

**Comece agora:** [GUIA_RAPIDO_ROLETA.md](GUIA_RAPIDO_ROLETA.md)

---

<div align="center">

**🎰 Boa sorte com sua roleta de prêmios! 🎰**

[![Documentação](https://img.shields.io/badge/Documentação-Completa-success)](INDICE_ROLETA.md)
[![Testes](https://img.shields.io/badge/Testes-Aprovado-success)](TESTE_ROLETA.md)
[![Código](https://img.shields.io/badge/Código-Limpo-success)](.)

</div>

