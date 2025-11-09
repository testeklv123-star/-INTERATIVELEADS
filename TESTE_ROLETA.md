# 🧪 Guia de Teste - Roleta de Prêmios

Este documento contém instruções passo a passo para testar a funcionalidade da Roleta de Prêmios.

## 📋 Pré-requisitos

Antes de testar, certifique-se de que:

- [x] O aplicativo está rodando no modo Electron (não no navegador)
- [x] A biblioteca `react-roulette-pro` foi instalada
- [x] Todos os arquivos foram criados/modificados corretamente
- [x] O banco de dados foi inicializado

---

## 🚀 Teste 1: Inicialização do Sistema

### Objetivo
Verificar se as tabelas e prêmios foram criados corretamente.

### Passos

1. **Inicie o aplicativo Electron**
   ```bash
   npm run electron:dev
   ```

2. **Abra o DevTools** (F12 ou Ctrl+Shift+I)

3. **Verifique os logs no console**
   Você deve ver:
   ```
   ✅ Tabela roulette_prizes verificada/criada.
   ✅ Tabela lead_spins verificada/criada.
   ✅ Prêmio "Cupom 10% OFF" inserido com sucesso!
   ✅ Prêmio "Brinde Exclusivo" inserido com sucesso!
   ✅ Prêmio "Cupom 20% OFF" inserido com sucesso!
   ✅ Prêmio "Produto Premium" inserido com sucesso!
   ✅ Prêmio "Super Prêmio" inserido com sucesso!
   🎉 5 prêmios inseridos com sucesso!
   🎰 Sistema de roleta inicializado com sucesso!
   ```

### Resultado Esperado
✅ Todas as mensagens de sucesso aparecem  
✅ Nenhum erro no console  
✅ Aplicativo inicia normalmente

---

## 🎯 Teste 2: Fluxo Completo do Usuário

### Objetivo
Testar o fluxo completo desde o formulário até a roleta.

### Passos

1. **Navegue até a tela inicial**
   - Clique em qualquer área da tela de atração

2. **Selecione um tenant** (se necessário)
   - Escolha "Tech Store SP" ou outro tenant configurado

3. **Selecione um jogo**
   - Clique em qualquer jogo disponível (ex: "Roleta de Prêmios")

4. **Preencha o formulário de lead**
   - Nome: "João Silva"
   - Email: "joao@teste.com"
   - Telefone: "(11) 99999-9999"
   - ✅ Aceite os termos

5. **Clique em "JOGAR AGORA"**

6. **Aguarde a modal da roleta aparecer**
   - A modal deve cobrir toda a tela
   - A roleta deve estar visível
   - Botão "GIRAR ROLETA" deve estar disponível

7. **Clique em "GIRAR ROLETA"**
   - Animação de 5 segundos deve iniciar
   - A roleta deve girar
   - Botão deve ficar desabilitado

8. **Aguarde o resultado**
   - Após 5 segundos, a roleta para
   - Resultado é exibido com:
     - Imagem do prêmio
     - Nome do prêmio
     - Mensagem "🎉 Parabéns!"
     - Botão "CONTINUAR"

9. **Clique em "CONTINUAR"**
   - Modal fecha
   - Navega para o jogo selecionado

### Resultado Esperado
✅ Fluxo completo funciona sem erros  
✅ Roleta aparece após envio do formulário  
✅ Animação é suave e sem travamentos  
✅ Resultado é exibido corretamente  
✅ Navegação continua normalmente

---

## 🔍 Teste 3: Verificação no Banco de Dados

### Objetivo
Confirmar que os dados foram salvos corretamente.

### Passos

1. **Localize o banco de dados**
   - Windows: `%APPDATA%/InterativeLeads/interativeleads.db`
   - Mac: `~/Library/Application Support/InterativeLeads/interativeleads.db`
   - Linux: `~/.config/InterativeLeads/interativeleads.db`

2. **Abra com DB Browser for SQLite** (ou similar)

3. **Execute as consultas SQL**

   ```sql
   -- Ver prêmios cadastrados
   SELECT * FROM roulette_prizes;
   ```
   
   **Resultado esperado:** 5 prêmios listados

   ```sql
   -- Ver leads cadastrados
   SELECT * FROM leads ORDER BY created_at DESC LIMIT 5;
   ```
   
   **Resultado esperado:** Lead "João Silva" aparece com `prize_won` preenchido

   ```sql
   -- Ver giros realizados
   SELECT 
     ls.id,
     l.name as lead_name,
     l.email,
     rp.name as prize_name,
     ls.created_at
   FROM lead_spins ls
   JOIN leads l ON ls.lead_id = l.id
   JOIN roulette_prizes rp ON ls.prize_id = rp.id
   ORDER BY ls.created_at DESC;
   ```
   
   **Resultado esperado:** Registro do giro com lead e prêmio vinculados

### Resultado Esperado
✅ Prêmios estão na tabela `roulette_prizes`  
✅ Lead foi salvo com `prize_won` preenchido  
✅ Registro do giro está na tabela `lead_spins`  
✅ Foreign keys estão corretas

---

## 🎲 Teste 4: Probabilidades

### Objetivo
Verificar se o sistema de probabilidades está funcionando.

### Passos

1. **Crie 20 leads de teste**
   - Preencha o formulário 20 vezes
   - Use emails diferentes: teste1@email.com, teste2@email.com, etc.

2. **Execute a consulta SQL**
   ```sql
   SELECT 
     rp.name,
     rp.probability as probabilidade_esperada,
     COUNT(ls.id) as vezes_ganho,
     ROUND(COUNT(ls.id) * 100.0 / (SELECT COUNT(*) FROM lead_spins), 2) as probabilidade_real
   FROM roulette_prizes rp
   LEFT JOIN lead_spins ls ON rp.id = ls.prize_id
   GROUP BY rp.id
   ORDER BY probabilidade_real DESC;
   ```

3. **Analise os resultados**
   - Compare `probabilidade_esperada` com `probabilidade_real`
   - Com 20 amostras, pode haver variação
   - Com 100+ amostras, deve convergir para o esperado

### Resultado Esperado
✅ Prêmios com maior probabilidade aparecem mais  
✅ Prêmios com menor probabilidade aparecem menos  
✅ Distribuição é aleatória mas respeita as probabilidades

**Exemplo de resultado:**
```
| Nome              | Prob. Esperada | Vezes Ganho | Prob. Real |
|-------------------|----------------|-------------|------------|
| Cupom 10% OFF     | 35             | 7           | 35.00%     |
| Brinde Exclusivo  | 30             | 6           | 30.00%     |
| Cupom 20% OFF     | 20             | 4           | 20.00%     |
| Produto Premium   | 10             | 2           | 10.00%     |
| Super Prêmio      | 5              | 1           | 5.00%      |
```

---

## 🖥️ Teste 5: Console e Logs

### Objetivo
Verificar se os logs estão corretos e ajudam no debug.

### Passos

1. **Abra o DevTools** (F12)

2. **Vá para a aba Console**

3. **Preencha e envie o formulário**

4. **Observe os logs**
   Você deve ver (em ordem):
   ```
   💾 [BACKEND] save-lead chamado: {...}
   ✅ [BACKEND] Lead salvo com ID: 1
   ✅ Lead salvo no Electron! ID: 1
   🎲 Sorteando prêmio...
   🎲 [BACKEND] get-random-prize chamado
   ✅ [BACKEND] Prêmio sorteado: Cupom 10% OFF
   ✅ Prêmio sorteado: Cupom 10% OFF
   ```

5. **Clique em "GIRAR ROLETA"**
   ```
   (Animação por 5 segundos)
   ```

6. **Após o giro**
   ```
   🎉 Giro completo! Prêmio: Cupom 10% OFF
   💾 [BACKEND] save-spin-result chamado: Lead 1, Prêmio 1
   ✅ [BACKEND] Resultado do giro salvo com sucesso
   ✅ Resultado do giro salvo!
   ```

### Resultado Esperado
✅ Todos os logs aparecem na ordem correta  
✅ Não há erros (mensagens em vermelho)  
✅ IDs de lead e prêmio são válidos  
✅ Timestamps estão corretos

---

## 🎨 Teste 6: Interface Visual

### Objetivo
Verificar se a interface está responsiva e bonita.

### Passos

1. **Teste em diferentes resoluções**
   - 1920x1080 (Full HD)
   - 1366x768 (HD)
   - 1024x768 (Tablet)

2. **Verifique elementos visuais**
   - [ ] Modal cobre toda a tela
   - [ ] Roleta está centralizada
   - [ ] Cores dos segmentos são visíveis
   - [ ] Texto é legível
   - [ ] Botões têm tamanho adequado
   - [ ] Imagens dos prêmios carregam
   - [ ] Animação é suave

3. **Teste interações**
   - [ ] Hover nos botões funciona
   - [ ] Clique no botão responde
   - [ ] Modal não fecha acidentalmente
   - [ ] Scroll funciona se necessário

### Resultado Esperado
✅ Interface é responsiva  
✅ Cores seguem o tema do tenant  
✅ Fontes são legíveis  
✅ Animações são suaves  
✅ Não há elementos cortados ou sobrepostos

---

## 🔄 Teste 7: Múltiplos Giros

### Objetivo
Testar se o sistema aguenta múltiplos giros seguidos.

### Passos

1. **Crie 10 leads rapidamente**
   - Use um script ou preencha manualmente
   - Gire a roleta para cada um

2. **Verifique no banco**
   ```sql
   SELECT COUNT(*) FROM lead_spins;
   ```
   **Resultado esperado:** 10 registros

3. **Verifique a performance**
   - [ ] Aplicativo não trava
   - [ ] Banco de dados responde rápido
   - [ ] Animações continuam suaves
   - [ ] Memória não aumenta excessivamente

### Resultado Esperado
✅ Sistema aguenta múltiplos giros  
✅ Performance se mantém estável  
✅ Não há memory leaks  
✅ Todos os dados são salvos corretamente

---

## ⚠️ Teste 8: Casos de Erro

### Objetivo
Verificar como o sistema lida com erros.

### Teste 8.1: Sem Prêmios no Banco

1. **Delete todos os prêmios**
   ```sql
   DELETE FROM roulette_prizes;
   ```

2. **Tente enviar o formulário**

3. **Resultado esperado:**
   - Erro é logado no console
   - Mensagem amigável ao usuário
   - Aplicativo não trava

### Teste 8.2: Banco de Dados Corrompido

1. **Feche o aplicativo**

2. **Delete o arquivo do banco**

3. **Reinicie o aplicativo**

4. **Resultado esperado:**
   - Novo banco é criado
   - Prêmios padrão são inseridos
   - Sistema funciona normalmente

### Teste 8.3: Imagem Quebrada

1. **Edite um prêmio com URL inválida**
   ```sql
   UPDATE roulette_prizes 
   SET image_url = 'https://url-invalida.com/imagem.png'
   WHERE id = 1;
   ```

2. **Gire a roleta**

3. **Resultado esperado:**
   - Imagem não carrega (ícone quebrado)
   - Mas o nome do prêmio aparece
   - Sistema continua funcionando

---

## 📊 Checklist Final

Antes de considerar o teste completo, verifique:

### Funcionalidade
- [ ] Prêmios são criados na inicialização
- [ ] Formulário salva o lead
- [ ] Prêmio é sorteado aleatoriamente
- [ ] Roleta aparece após envio
- [ ] Animação funciona corretamente
- [ ] Resultado é exibido
- [ ] Resultado é salvo no banco
- [ ] Campo `prize_won` é atualizado
- [ ] Navegação continua após fechar

### Performance
- [ ] Aplicativo inicia em < 5 segundos
- [ ] Formulário responde instantaneamente
- [ ] Animação é suave (60 FPS)
- [ ] Banco de dados responde rápido
- [ ] Memória não vaza

### Interface
- [ ] Design é bonito e profissional
- [ ] Cores seguem o tema
- [ ] Fontes são legíveis
- [ ] Responsivo em diferentes resoluções
- [ ] Acessível (contraste, tamanhos)

### Dados
- [ ] Prêmios são salvos corretamente
- [ ] Leads são salvos corretamente
- [ ] Giros são salvos corretamente
- [ ] Foreign keys funcionam
- [ ] Probabilidades são respeitadas

### Logs e Debug
- [ ] Logs são claros e úteis
- [ ] Erros são tratados
- [ ] Console não tem warnings
- [ ] Stack traces são legíveis

---

## 🐛 Problemas Comuns e Soluções

### Problema: Roleta não aparece
**Solução:**
1. Verifique se está no Electron (não no navegador)
2. Abra o console e procure por erros
3. Confirme que `showRoulette` é `true`
4. Verifique se `prizes` tem dados

### Problema: Animação trava
**Solução:**
1. Feche outros aplicativos pesados
2. Verifique se a GPU está sendo usada
3. Reduza o tempo de animação em `Roulette.tsx`

### Problema: Prêmio não é salvo
**Solução:**
1. Verifique se `currentLeadId` não é null
2. Confirme que a tabela `lead_spins` existe
3. Verifique os logs do console
4. Teste a query SQL manualmente

### Problema: Probabilidades não funcionam
**Solução:**
1. Confirme que a soma das probabilidades é 100
2. Teste com mais amostras (100+)
3. Verifique a função `getRandomPrize()`

---

## 📝 Relatório de Teste

Use este template para documentar seus testes:

```markdown
# Relatório de Teste - Roleta de Prêmios

**Data:** ___/___/______
**Testador:** _______________
**Versão:** _______________

## Testes Realizados

| # | Teste | Status | Observações |
|---|-------|--------|-------------|
| 1 | Inicialização | ✅/❌ | |
| 2 | Fluxo Completo | ✅/❌ | |
| 3 | Banco de Dados | ✅/❌ | |
| 4 | Probabilidades | ✅/❌ | |
| 5 | Console e Logs | ✅/❌ | |
| 6 | Interface Visual | ✅/❌ | |
| 7 | Múltiplos Giros | ✅/❌ | |
| 8 | Casos de Erro | ✅/❌ | |

## Bugs Encontrados

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

## Melhorias Sugeridas

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

## Conclusão

[ ] Aprovado para produção
[ ] Necessita correções
[ ] Necessita mais testes

**Assinatura:** _______________
```

---

## 🎓 Dicas de Teste

1. **Teste em Ambiente Limpo**: Delete o banco antes de testar
2. **Use Dados Reais**: Teste com nomes e emails realistas
3. **Documente Tudo**: Anote bugs e comportamentos estranhos
4. **Teste Edge Cases**: Valores extremos, campos vazios, etc.
5. **Peça Feedback**: Mostre para outras pessoas e observe o uso

---

**Bons testes! 🧪**

Se encontrar algum problema, consulte:
- `ROLETA_PREMIOS_IMPLEMENTACAO.md` - Documentação completa
- `EXEMPLO_PREMIOS_CUSTOMIZADOS.md` - Como personalizar prêmios
- Console do navegador (F12) - Logs e erros

