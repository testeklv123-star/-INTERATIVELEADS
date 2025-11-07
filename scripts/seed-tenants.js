#!/usr/bin/env node
/**
 * 🌱 Script de Seed - Popular Banco com Tenants de Teste
 * 
 * Este script insere tenants de demonstração no banco SQLite do Electron
 * para permitir testar a aplicação imediatamente.
 * 
 * Uso: node scripts/seed-tenants.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const os = require('os');
const fs = require('fs');

// Cores para output no console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Define o caminho do banco de dados (mesmo usado pelo Electron)
function getDatabasePath() {
  const platform = process.platform;
  let appDataPath;

  if (platform === 'win32') {
    appDataPath = path.join(process.env.APPDATA || '', 'InterativeLeads');
  } else if (platform === 'darwin') {
    appDataPath = path.join(os.homedir(), 'Library', 'Application Support', 'InterativeLeads');
  } else {
    appDataPath = path.join(os.homedir(), '.config', 'InterativeLeads');
  }

  return path.join(appDataPath, 'interativeleads.db');
}

// Tenants de demonstração
const demoTenants = [
  {
    tenant_id: 'loja_tech_sp_001',
    brand_name: 'Tech Store São Paulo',
    admin_password: '1234',
    content: {
      welcome_title: 'Bem-vindo à Tech Store!',
      welcome_subtitle: 'Participe e ganhe prêmios incríveis',
      form_title: 'Cadastre-se para jogar',
      form_subtitle: 'Seus dados são seguros conosco',
      thank_you_message: 'Obrigado por participar! Enviaremos seu prêmio por e-mail.',
      privacy_notice: 'Ao participar, você aceita nossa política de privacidade.'
    },
    theme: {
      colors: {
        primary: '#FF6B35',
        secondary: '#004E89',
        accent: '#F7931E',
        background: '#FFFFFF',
        text: '#1A1A1A',
        text_secondary: '#666666',
        success: '#28A745',
        error: '#DC3545',
        button_primary_bg: '#FF6B35',
        button_primary_text: '#FFFFFF',
        button_secondary_bg: '#004E89',
        button_secondary_text: '#FFFFFF'
      },
      typography: {
        font_primary: 'Montserrat',
        font_secondary: 'Open Sans',
        heading_weight: '700',
        body_weight: '400'
      },
      logos: {
        main_logo_url: '/logos/tech-store-main.svg',
        center_logo_url: '/logos/tech-store-icon.svg',
        watermark_url: '/logos/tech-store-icon.svg'
      },
      spacing: {
        border_radius: '12px',
        padding_base: '16px'
      }
    },
    games_config: {
      enabled_games: ['prize_wheel', 'scratch_card', 'quiz'],
      prize_wheel: {
        prizes: [
          { id: 'p1', label: '10% OFF', name: 'Cupom de 10% de desconto', probability: 40, color: '#FF6B35', quantity_available: 100, quantity_total: 100, times_won: 0 },
          { id: 'p2', label: 'Brinde', name: 'Chaveiro exclusivo', probability: 30, color: '#004E89', quantity_available: 50, quantity_total: 50, times_won: 0 },
          { id: 'p3', label: '20% OFF', name: 'Cupom de 20% de desconto', probability: 20, color: '#F7931E', quantity_available: 30, quantity_total: 30, times_won: 0 },
          { id: 'p4', label: 'Fone BT', name: 'Fone Bluetooth', probability: 10, color: '#28A745', quantity_available: 10, quantity_total: 10, times_won: 0 }
        ]
      },
      scratch_card: {
        overlay_color: '#C0C0C0',
        prizes: [
          { id: 's1', name: 'Desconto 15%', probability: 40, quantity_available: 80, quantity_total: 80, times_won: 0 },
          { id: 's2', name: 'Brinde Exclusivo', probability: 30, quantity_available: 50, quantity_total: 50, times_won: 0 },
          { id: 's3', name: 'Frete Grátis', probability: 20, quantity_available: 30, quantity_total: 30, times_won: 0 },
          { id: 's4', name: 'Vale R$50', probability: 10, quantity_available: 10, quantity_total: 10, times_won: 0 }
        ]
      },
      quiz: {
        questions: [
          { id: 'q1', question: 'Qual nosso produto mais vendido?', options: ['Fones', 'Capinhas', 'Carregadores', 'Cabos'], correct: 0 },
          { id: 'q2', question: 'Qual a cor principal da nossa marca?', options: ['Azul', 'Laranja', 'Verde', 'Preto'], correct: 1 }
        ],
        prize_rules: [
          { min_correct: 0, max_correct: 0, prize_name: 'Participação - Obrigado!', quantity_available: 1000 },
          { min_correct: 1, max_correct: 1, prize_name: 'Brinde Especial', quantity_available: 50 },
          { min_correct: 2, max_correct: 2, prize_name: 'Cupom 20% OFF', quantity_available: 20 }
        ]
      }
    },
    form_fields: {
      required: ['name', 'email', 'phone'],
      optional: [],
      custom_field: { enabled: false, label: '', type: 'text', options: [] }
    },
    behavior: { inactivity_timeout: 30, auto_return_home: true, show_lead_count: false, collect_photo: false, admin_password: '1234' }
  },
  {
    tenant_id: 'evento_tech_2025',
    brand_name: 'Tech Conference 2025',
    admin_password: '2025',
    content: {
      welcome_title: 'Bem-vindo à Tech Conference 2025!',
      welcome_subtitle: 'Participe dos sorteios exclusivos',
      form_title: 'Cadastre-se no evento',
      form_subtitle: 'Ganhe brindes e participe dos sorteios',
      thank_you_message: 'Obrigado! Nos vemos no evento!',
      privacy_notice: 'Ao participar, você aceita nossa política de privacidade.'
    },
    theme: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#EC4899',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#1A1A1A',
        text_secondary: '#6B7280',
        success: '#10B981',
        error: '#EF4444',
        button_primary_bg: '#8B5CF6',
        button_primary_text: '#FFFFFF',
        button_secondary_bg: '#EC4899',
        button_secondary_text: '#FFFFFF'
      },
      typography: {
        font_primary: 'Poppins',
        font_secondary: 'Inter',
        heading_weight: '700',
        body_weight: '400'
      },
      logos: {
        main_logo_url: '/logos/tech-conference-main.svg',
        center_logo_url: '/logos/tech-conference-icon.svg',
        watermark_url: '/logos/tech-conference-icon.svg'
      },
      spacing: {
        border_radius: '16px',
        padding_base: '16px'
      }
    },
    games_config: {
      enabled_games: ['prize_wheel', 'quiz'],
      prize_wheel: {
        prizes: [
          { id: 'p1', label: 'Camiseta', name: 'Camiseta Tech Conference', probability: 50, color: '#8B5CF6', quantity_available: 200, quantity_total: 200, times_won: 0 },
          { id: 'p2', label: 'Caneca', name: 'Caneca personalizada', probability: 30, color: '#EC4899', quantity_available: 100, quantity_total: 100, times_won: 0 },
          { id: 'p3', label: 'Mochila', name: 'Mochila Tech Conference', probability: 15, color: '#F59E0B', quantity_available: 50, quantity_total: 50, times_won: 0 },
          { id: 'p4', label: 'Ingresso VIP', name: 'Upgrade para VIP', probability: 5, color: '#10B981', quantity_available: 10, quantity_total: 10, times_won: 0 }
        ]
      },
      scratch_card: {
        overlay_color: '#C0C0C0',
        prizes: [
          { id: 's1', name: 'Camiseta', probability: 40, quantity_available: 100, quantity_total: 100, times_won: 0 },
          { id: 's2', name: 'Caneca', probability: 30, quantity_available: 80, quantity_total: 80, times_won: 0 },
          { id: 's3', name: 'Adesivos', probability: 20, quantity_available: 150, quantity_total: 150, times_won: 0 },
          { id: 's4', name: 'Pin', probability: 10, quantity_available: 50, quantity_total: 50, times_won: 0 }
        ]
      },
      quiz: {
        questions: [
          { id: 'q1', question: 'Qual o tema do evento?', options: ['IA', 'Cloud', 'DevOps', 'Blockchain'], correct: 0 },
          { id: 'q2', question: 'Onde será o evento?', options: ['SP', 'RJ', 'BH', 'Online'], correct: 3 },
          { id: 'q3', question: 'Quantos dias dura o evento?', options: ['1 dia', '2 dias', '3 dias', '4 dias'], correct: 2 }
        ],
        prize_rules: [
          { min_correct: 0, max_correct: 0, prize_name: 'Certificado Digital', quantity_available: 500 },
          { min_correct: 1, max_correct: 2, prize_name: 'Adesivo + Pin', quantity_available: 100 },
          { min_correct: 3, max_correct: 3, prize_name: 'Camiseta Exclusiva', quantity_available: 30 }
        ]
      }
    },
    form_fields: {
      required: ['name', 'email'],
      optional: ['phone'],
      custom_field: {
        enabled: true,
        label: 'Área de interesse',
        type: 'select',
        options: ['Frontend', 'Backend', 'DevOps', 'Data Science', 'IA/ML']
      }
    },
    behavior: { inactivity_timeout: 45, auto_return_home: true, show_lead_count: false, collect_photo: false, admin_password: '2025' }
  },
  {
    tenant_id: 'demo_padrao',
    brand_name: 'Demo - Cliente Padrão',
    admin_password: '0000',
    content: {
      welcome_title: 'Bem-vindo!',
      welcome_subtitle: 'Participe e ganhe prêmios',
      form_title: 'Cadastre-se',
      form_subtitle: 'Preencha seus dados',
      thank_you_message: 'Obrigado por participar!',
      privacy_notice: 'Política de privacidade.'
    },
    theme: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#111827',
        text_secondary: '#6B7280',
        success: '#10B981',
        error: '#EF4444',
        button_primary_bg: '#3B82F6',
        button_primary_text: '#FFFFFF',
        button_secondary_bg: '#10B981',
        button_secondary_text: '#FFFFFF'
      },
      typography: {
        font_primary: 'Inter',
        font_secondary: 'Roboto',
        heading_weight: '700',
        body_weight: '400'
      },
      logos: {
        main_logo_url: '',
        center_logo_url: '',
        watermark_url: ''
      },
      spacing: {
        border_radius: '8px',
        padding_base: '16px'
      }
    },
    games_config: {
      enabled_games: ['prize_wheel'],
      prize_wheel: {
        prizes: [
          { id: 'p1', label: 'Prêmio 1', name: 'Brinde 1', probability: 40, color: '#3B82F6', quantity_available: 50, quantity_total: 50, times_won: 0 },
          { id: 'p2', label: 'Prêmio 2', name: 'Brinde 2', probability: 30, color: '#10B981', quantity_available: 30, quantity_total: 30, times_won: 0 },
          { id: 'p3', label: 'Prêmio 3', name: 'Brinde 3', probability: 20, color: '#F59E0B', quantity_available: 15, quantity_total: 15, times_won: 0 },
          { id: 'p4', label: 'Prêmio 4', name: 'Brinde 4', probability: 10, color: '#EF4444', quantity_available: 5, quantity_total: 5, times_won: 0 }
        ]
      },
      scratch_card: {
        overlay_color: '#C0C0C0',
        prizes: []
      },
      quiz: {
        questions: [],
        prize_rules: []
      }
    },
    form_fields: {
      required: ['name', 'email'],
      optional: ['phone'],
      custom_field: { enabled: false, label: '', type: 'text', options: [] }
    },
    behavior: { inactivity_timeout: 30, auto_return_home: true, show_lead_count: false, collect_photo: false, admin_password: '0000' }
  }
];

// Função auxiliar para executar queries
function runQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function getQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function seedTenants() {
  const dbPath = getDatabasePath();
  
  log('\n🌱 SEED DE TENANTS - InterativeLeads', 'bright');
  log('═══════════════════════════════════════\n', 'cyan');
  
  log(`📂 Caminho do banco: ${dbPath}`, 'blue');

  // Verifica se o banco existe
  if (!fs.existsSync(dbPath)) {
    log('\n❌ ERRO: Banco de dados não encontrado!', 'red');
    log('   Execute o aplicativo Electron primeiro para criar o banco.', 'yellow');
    log('   Comando: npm run electron:dev\n', 'yellow');
    process.exit(1);
  }

  // Conecta ao banco
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      log(`\n❌ Erro ao conectar ao banco: ${err.message}`, 'red');
      process.exit(1);
    }
  });

  try {
    log('✅ Conectado ao banco de dados', 'green');
    
    // Verifica quantos tenants já existem
    const existingCount = await getQuery(db, 'SELECT COUNT(*) as count FROM tenants');
    log(`\n📊 Tenants existentes: ${existingCount.count}`, 'cyan');

    let inserted = 0;
    let skipped = 0;

    for (const tenant of demoTenants) {
      try {
        // Verifica se o tenant já existe
        const existing = await getQuery(
          db,
          'SELECT tenant_id FROM tenants WHERE tenant_id = ?',
          [tenant.tenant_id]
        );

        if (existing) {
          log(`⏭️  Pulando "${tenant.brand_name}" (já existe)`, 'yellow');
          skipped++;
          continue;
        }

        // Insere o tenant com todos os campos
        await runQuery(
          db,
          `INSERT INTO tenants (tenant_id, brand_name, admin_password, theme, content, games_config, form_fields, behavior) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            tenant.tenant_id,
            tenant.brand_name,
            tenant.admin_password,
            JSON.stringify(tenant.theme),
            JSON.stringify(tenant.content),
            JSON.stringify(tenant.games_config),
            JSON.stringify(tenant.form_fields),
            JSON.stringify(tenant.behavior)
          ]
        );

        log(`✅ Inserido: "${tenant.brand_name}" (ID: ${tenant.tenant_id})`, 'green');
        log(`   Senha admin: ${tenant.admin_password}`, 'cyan');
        inserted++;
      } catch (err) {
        log(`❌ Erro ao inserir "${tenant.brand_name}": ${err.message}`, 'red');
      }
    }

    // Resumo final
    log('\n═══════════════════════════════════════', 'cyan');
    log('📊 RESUMO:', 'bright');
    log(`   ✅ Inseridos: ${inserted}`, 'green');
    log(`   ⏭️  Pulados: ${skipped}`, 'yellow');
    log(`   📦 Total no banco: ${existingCount.count + inserted}`, 'blue');
    
    if (inserted > 0) {
      log('\n🎉 SUCESSO! Tenants de teste criados!', 'green');
      log('\n📝 PRÓXIMOS PASSOS:', 'bright');
      log('   1. Execute: npm run electron:dev', 'cyan');
      log('   2. Escolha um dos tenants na tela de seleção', 'cyan');
      log('   3. Use as senhas listadas acima para acessar o admin\n', 'cyan');
    } else {
      log('\n✅ Banco já contém todos os tenants de teste', 'green');
    }

  } catch (err) {
    log(`\n❌ ERRO: ${err.message}`, 'red');
    process.exit(1);
  } finally {
    db.close();
  }
}

// Executa o seed
seedTenants().catch(err => {
  log(`\n❌ Erro fatal: ${err.message}`, 'red');
  process.exit(1);
});

