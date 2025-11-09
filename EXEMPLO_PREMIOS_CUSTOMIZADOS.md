# 🎁 Como Adicionar Prêmios Customizados

Este guia mostra como personalizar os prêmios da roleta no seu projeto.

## 📝 Método 1: Editar Prêmios Padrão (Recomendado)

Edite o arquivo `electron/rouletteService.js` na função `seedPrizes()`:

```javascript
const defaultPrizes = [
  {
    name: 'Cupom 10% OFF',
    image_url: 'https://via.placeholder.com/150/FF6B35/FFFFFF?text=10%25+OFF',
    color: '#FF6B35',
    probability: 35
  },
  {
    name: 'Brinde Exclusivo',
    image_url: 'https://via.placeholder.com/150/004E89/FFFFFF?text=Brinde',
    color: '#004E89',
    probability: 30
  },
  // Adicione mais prêmios aqui...
];
```

### Campos Obrigatórios:

- **name** (string): Nome do prêmio exibido ao usuário
- **image_url** (string): URL da imagem do prêmio
- **color** (string): Cor hexadecimal para o segmento da roleta
- **probability** (number): Probabilidade em porcentagem (0-100)

⚠️ **Importante**: A soma das probabilidades deve ser 100!

---

## 🖼️ Método 2: Usar Imagens Locais

### Passo 1: Adicione as imagens na pasta `public/prizes/`

```
public/
  └── prizes/
      ├── cupom-10.png
      ├── brinde.png
      ├── cupom-20.png
      └── produto-premium.png
```

### Passo 2: Referencie as imagens locais

```javascript
const defaultPrizes = [
  {
    name: 'Cupom 10% OFF',
    image_url: '/prizes/cupom-10.png', // ← Caminho local
    color: '#FF6B35',
    probability: 35
  },
  {
    name: 'Brinde Exclusivo',
    image_url: '/prizes/brinde.png', // ← Caminho local
    color: '#004E89',
    probability: 30
  },
];
```

---

## 🎨 Método 3: Gerar Imagens com Placeholder

Use serviços online para gerar imagens rapidamente:

### Via Placeholder (Usado por padrão)
```
https://via.placeholder.com/150/COR_HEX/COR_TEXTO?text=TEXTO
```

**Exemplos:**
```javascript
// Fundo laranja, texto branco
'https://via.placeholder.com/150/FF6B35/FFFFFF?text=10%25+OFF'

// Fundo azul, texto branco
'https://via.placeholder.com/150/004E89/FFFFFF?text=Brinde'

// Fundo verde, texto preto
'https://via.placeholder.com/150/28A745/000000?text=Premium'
```

### Unsplash (Imagens reais)
```
https://source.unsplash.com/150x150/?gift,prize
```

### Lorem Picsum (Imagens aleatórias)
```
https://picsum.photos/150/150
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Loja de Roupas
```javascript
const defaultPrizes = [
  {
    name: 'Cupom 15% OFF',
    image_url: '/prizes/cupom-15.png',
    color: '#E91E63',
    probability: 40
  },
  {
    name: 'Camiseta Grátis',
    image_url: '/prizes/camiseta.png',
    color: '#9C27B0',
    probability: 25
  },
  {
    name: 'Frete Grátis',
    image_url: '/prizes/frete.png',
    color: '#3F51B5',
    probability: 20
  },
  {
    name: 'Vale R$ 50',
    image_url: '/prizes/vale-50.png',
    color: '#4CAF50',
    probability: 10
  },
  {
    name: 'Vale R$ 100',
    image_url: '/prizes/vale-100.png',
    color: '#FF9800',
    probability: 5
  }
];
```

### Exemplo 2: Restaurante
```javascript
const defaultPrizes = [
  {
    name: 'Sobremesa Grátis',
    image_url: '/prizes/sobremesa.png',
    color: '#FF6B6B',
    probability: 45
  },
  {
    name: 'Refrigerante Grátis',
    image_url: '/prizes/refri.png',
    color: '#4ECDC4',
    probability: 30
  },
  {
    name: '20% de Desconto',
    image_url: '/prizes/desconto-20.png',
    color: '#45B7D1',
    probability: 15
  },
  {
    name: 'Refeição Grátis',
    image_url: '/prizes/refeicao.png',
    color: '#96CEB4',
    probability: 10
  }
];
```

### Exemplo 3: Academia
```javascript
const defaultPrizes = [
  {
    name: '1 Aula Experimental',
    image_url: '/prizes/aula-gratis.png',
    color: '#FF6B35',
    probability: 40
  },
  {
    name: 'Garrafa Squeeze',
    image_url: '/prizes/squeeze.png',
    color: '#004E89',
    probability: 30
  },
  {
    name: '1 Mês Grátis',
    image_url: '/prizes/mes-gratis.png',
    color: '#F7931E',
    probability: 15
  },
  {
    name: 'Avaliação Física',
    image_url: '/prizes/avaliacao.png',
    color: '#28A745',
    probability: 10
  },
  {
    name: 'Personal Trainer',
    image_url: '/prizes/personal.png',
    color: '#DC3545',
    probability: 5
  }
];
```

---

## 🎯 Ajustando Probabilidades

### Regra de Ouro
A soma de todas as probabilidades deve ser **100**.

### Exemplos de Distribuição:

#### Distribuição Equilibrada (4 prêmios)
```javascript
Prêmio A: 25%
Prêmio B: 25%
Prêmio C: 25%
Prêmio D: 25%
Total: 100% ✅
```

#### Distribuição Piramidal (5 prêmios)
```javascript
Prêmio Comum: 40%
Prêmio Incomum: 30%
Prêmio Raro: 20%
Prêmio Épico: 8%
Prêmio Lendário: 2%
Total: 100% ✅
```

#### Distribuição Customizada (3 prêmios)
```javascript
Prêmio Fácil: 60%
Prêmio Médio: 30%
Prêmio Difícil: 10%
Total: 100% ✅
```

---

## 🔄 Como Aplicar as Mudanças

### Método 1: Deletar o Banco de Dados (Recomendado para Desenvolvimento)

1. Feche o aplicativo Electron
2. Localize o banco de dados:
   - Windows: `%APPDATA%/InterativeLeads/interativeleads.db`
   - Mac: `~/Library/Application Support/InterativeLeads/interativeleads.db`
   - Linux: `~/.config/InterativeLeads/interativeleads.db`
3. Delete o arquivo `interativeleads.db`
4. Reinicie o aplicativo
5. Os novos prêmios serão criados automaticamente

### Método 2: Atualizar Manualmente (Produção)

Use um cliente SQLite (como DB Browser for SQLite) para executar:

```sql
-- Limpar prêmios existentes
DELETE FROM roulette_prizes;

-- Inserir novos prêmios
INSERT INTO roulette_prizes (name, image_url, color, probability) VALUES
('Cupom 15% OFF', '/prizes/cupom-15.png', '#E91E63', 40),
('Camiseta Grátis', '/prizes/camiseta.png', '#9C27B0', 25),
('Frete Grátis', '/prizes/frete.png', '#3F51B5', 20),
('Vale R$ 50', '/prizes/vale-50.png', '#4CAF50', 10),
('Vale R$ 100', '/prizes/vale-100.png', '#FF9800', 5);
```

---

## 🎨 Paleta de Cores Sugeridas

### Cores Vibrantes
```javascript
'#FF6B6B' // Vermelho Coral
'#4ECDC4' // Turquesa
'#45B7D1' // Azul Céu
'#FFA07A' // Salmão
'#98D8C8' // Verde Menta
'#F7DC6F' // Amarelo Ouro
'#BB8FCE' // Roxo Lavanda
'#85C1E2' // Azul Bebê
```

### Cores Profissionais
```javascript
'#3498DB' // Azul Profissional
'#2ECC71' // Verde Sucesso
'#E74C3C' // Vermelho Alerta
'#F39C12' // Laranja Atenção
'#9B59B6' // Roxo Elegante
'#1ABC9C' // Verde Água
'#34495E' // Cinza Escuro
'#E67E22' // Laranja Queimado
```

---

## 📐 Especificações de Imagem

### Tamanho Recomendado
- **Dimensões**: 150x150 pixels (quadrado)
- **Formato**: PNG ou JPG
- **Peso**: Máximo 100KB por imagem
- **Fundo**: Transparente (PNG) ou sólido

### Dicas de Design
1. Use imagens simples e claras
2. Evite muito texto na imagem
3. Mantenha contraste alto
4. Teste em diferentes tamanhos de tela
5. Use ícones quando possível

---

## 🧪 Testando os Prêmios

### Console do Navegador (F12)
```javascript
// Ver prêmios carregados
console.log(prizes);

// Simular sorteio
electronService.getRandomPrize().then(console.log);
```

### Banco de Dados
```sql
-- Ver todos os prêmios
SELECT * FROM roulette_prizes;

-- Ver distribuição de giros
SELECT 
  rp.name,
  COUNT(ls.id) as vezes_ganho,
  rp.probability as probabilidade_esperada
FROM roulette_prizes rp
LEFT JOIN lead_spins ls ON rp.id = ls.prize_id
GROUP BY rp.id;
```

---

## ⚠️ Erros Comuns

### Erro: "Probabilidades não somam 100"
```javascript
// ❌ ERRADO (soma = 90)
probability: 30
probability: 30
probability: 30

// ✅ CORRETO (soma = 100)
probability: 33.33
probability: 33.33
probability: 33.34
```

### Erro: "Imagem não carrega"
```javascript
// ❌ ERRADO
image_url: 'prizes/cupom.png' // Falta a barra inicial

// ✅ CORRETO
image_url: '/prizes/cupom.png' // Com barra inicial
```

### Erro: "Cor não aparece"
```javascript
// ❌ ERRADO
color: 'red' // Nome de cor

// ✅ CORRETO
color: '#FF0000' // Código hexadecimal
```

---

## 🚀 Dicas Avançadas

### 1. Prêmios Sazonais
```javascript
const isChristmas = new Date().getMonth() === 11;
const prizes = isChristmas ? christmasPrizes : defaultPrizes;
```

### 2. Prêmios por Horário
```javascript
const hour = new Date().getHours();
const prizes = hour < 12 ? morningPrizes : afternoonPrizes;
```

### 3. Prêmios Limitados
```javascript
{
  name: 'iPhone 15 Pro',
  image_url: '/prizes/iphone.png',
  color: '#000000',
  probability: 0.1, // 0.1% = muito raro!
  stock: 1 // Apenas 1 disponível
}
```

---

## 📚 Recursos Úteis

### Geradores de Imagens
- [Placeholder.com](https://placeholder.com/)
- [Unsplash](https://unsplash.com/)
- [Pexels](https://www.pexels.com/)
- [Flaticon](https://www.flaticon.com/) (ícones)

### Ferramentas de Cor
- [Coolors.co](https://coolors.co/) - Paletas de cores
- [Adobe Color](https://color.adobe.com/) - Roda de cores
- [ColorHunt](https://colorhunt.co/) - Paletas prontas

### Editores de Imagem
- [Canva](https://www.canva.com/) - Design online
- [Photopea](https://www.photopea.com/) - Photoshop online
- [Remove.bg](https://www.remove.bg/) - Remover fundo

---

**Boa sorte com seus prêmios customizados! 🎁**

