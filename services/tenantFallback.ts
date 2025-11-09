import { TenantConfig } from '../types';

export const fallbackTenants: TenantConfig[] = [
  {
    tenant_id: 'loja_tech_sp_001',
    brand_name: 'Tech Store São Paulo',
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
    content: {
      welcome_title: 'Bem-vindo à Tech Store!',
      welcome_subtitle: 'Participe e ganhe prêmios incríveis',
      form_title: 'Cadastre-se para jogar',
      form_subtitle: 'Seus dados são seguros conosco',
      thank_you_message: 'Obrigado por participar! Enviaremos seu prêmio por e-mail.',
      privacy_notice: 'Ao participar, você aceita nossa política de privacidade.'
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
      custom_field: { enabled: false, label: '', type: 'select', options: [] }
    },
    behavior: { inactivity_timeout: 30, auto_return_home: true, show_lead_count: false, collect_photo: false, admin_password: '1234' }
  },
  {
    tenant_id: 'evento_tech_2025',
    brand_name: 'Tech Conference 2025',
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
    content: {
      welcome_title: 'Bem-vindo à Tech Conference 2025!',
      welcome_subtitle: 'Participe dos sorteios exclusivos',
      form_title: 'Cadastre-se no evento',
      form_subtitle: 'Ganhe brindes e participe dos sorteios',
      thank_you_message: 'Obrigado! Nos vemos no evento!',
      privacy_notice: 'Ao participar, você aceita nossa política de privacidade.'
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
    tenant_id: 'academia_fit_001',
    brand_name: 'Academia Fit',
    theme: {
      colors: {
        primary: '#00C853',      // Verde vibrante
        secondary: '#1976D2',    // Azul
        accent: '#FFD600',       // Amarelo
        background: '#FFFFFF',
        text: '#1A1A1A',
        text_secondary: '#666666',
        success: '#00C853',
        error: '#D32F2F',
        button_primary_bg: '#00C853',
        button_primary_text: '#FFFFFF',
        button_secondary_bg: '#1976D2',
        button_secondary_text: '#FFFFFF'
      },
      typography: {
        font_primary: 'Roboto',
        font_secondary: 'Open Sans',
        heading_weight: '700',
        body_weight: '400'
      },
      logos: {
        main_logo_url: '/logos/tech-store-main.svg',      // Você pode trocar depois
        center_logo_url: '/logos/tech-store-icon.svg',    // Você pode trocar depois
        watermark_url: '/logos/tech-store-icon.svg'       // Você pode trocar depois
      },
      spacing: {
        border_radius: '12px',
        padding_base: '16px'
      }
    },
    content: {
      welcome_title: 'Bem-vindo à Academia Fit!',
      welcome_subtitle: 'Participe e ganhe prêmios especiais',
      form_title: 'Cadastre-se e participe',
      form_subtitle: 'Preencha seus dados e concorra a prêmios',
      thank_you_message: 'Parabéns! Seu prêmio será enviado por e-mail.',
      privacy_notice: 'Seus dados estão seguros conosco. Política de privacidade disponível no site.'
    },
    games_config: {
      enabled_games: ['prize_wheel', 'scratch_card'],
      prize_wheel: {
        prizes: [
          { id: 'p1', label: '1 Mês Free', name: '1 Mês de academia grátis', probability: 10, color: '#00C853', quantity_available: 20, quantity_total: 20, times_won: 0 },
          { id: 'p2', label: '15% OFF', name: '15% de desconto na matrícula', probability: 30, color: '#1976D2', quantity_available: 50, quantity_total: 50, times_won: 0 },
          { id: 'p3', label: 'Kit Fit', name: 'Kit com garrafa e toalha', probability: 40, color: '#FFD600', quantity_available: 100, quantity_total: 100, times_won: 0 },
          { id: 'p4', label: 'Personal', name: '2 aulas com personal trainer', probability: 20, color: '#FF6D00', quantity_available: 30, quantity_total: 30, times_won: 0 }
        ]
      },
      scratch_card: {
        overlay_color: '#00C853',
        prizes: [
          { id: 's1', name: '10% de desconto', probability: 40, quantity_available: 100, quantity_total: 100, times_won: 0 },
          { id: 's2', name: 'Aula experimental grátis', probability: 30, quantity_available: 80, quantity_total: 80, times_won: 0 },
          { id: 's3', name: 'Avaliação física gratuita', probability: 20, quantity_available: 50, quantity_total: 50, times_won: 0 },
          { id: 's4', name: '1 semana grátis', probability: 10, quantity_available: 20, quantity_total: 20, times_won: 0 }
        ]
      },
      quiz: {
        questions: [
          { id: 'q1', question: 'Quantas vezes por semana você treina?', options: ['1-2 vezes', '3-4 vezes', '5+ vezes', 'Não treino'], correct: 1 },
          { id: 'q2', question: 'Qual seu objetivo principal?', options: ['Emagrecer', 'Ganhar massa', 'Saúde', 'Performance'], correct: 2 }
        ],
        prize_rules: [
          { min_correct: 0, max_correct: 0, prize_name: 'Consulta nutricional', quantity_available: 50 },
          { min_correct: 1, max_correct: 1, prize_name: '5% de desconto', quantity_available: 30 },
          { min_correct: 2, max_correct: 2, prize_name: '1 semana grátis', quantity_available: 15 }
        ]
      }
    },
    form_fields: {
      required: ['name', 'email', 'phone'],
      optional: [],
      custom_field: {
        enabled: true,
        label: 'Objetivo principal',
        type: 'select',
        options: ['Emagrecimento', 'Hipertrofia', 'Saúde e bem-estar', 'Performance esportiva', 'Outro']
      }
    },
    behavior: { 
      inactivity_timeout: 30, 
      auto_return_home: true, 
      show_lead_count: false, 
      collect_photo: false, 
      admin_password: 'fit123' 
    }
  }
];

export function getFallbackTenant(tenantId: string): TenantConfig | null {
  const normalized = tenantId.trim().toLowerCase();
  const match = fallbackTenants.find(({ tenant_id }) => tenant_id.toLowerCase() === normalized);
  return match ?? null;
}

export async function fetchTenantConfig(tenantId: string): Promise<TenantConfig> {
  const tenant = getFallbackTenant(tenantId);
  if (!tenant) {
    throw new Error('Tenant não encontrado nos dados locais');
  }
  return tenant;
}
