// Fix: Populated with type definitions based on usage in the app.
export interface Prize {
  id: string;
  label: string;
  name: string;
  probability: number;
  color: string;
  quantity_available?: number; // Estoque disponível
  quantity_total?: number; // Total inicial
  times_won?: number; // Quantas vezes foi ganho
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
}

export interface QuizPrizeRule {
  min_correct: number; // Mínimo de acertos
  max_correct: number; // Máximo de acertos
  prize_name: string;
  quantity_available?: number;
}

export interface ScratchCardPrize {
  id: string;
  name: string;
  probability: number;
  quantity_available?: number;
  quantity_total?: number;
  times_won?: number;
}

export interface GamesConfig {
  enabled_games: string[];
  prize_wheel: {
    prizes: Prize[];
  };
  scratch_card: {
    overlay_color: string;
    prizes: ScratchCardPrize[];
  };
  quiz: {
    questions: QuizQuestion[];
    prize_rules: QuizPrizeRule[];
  };
}

export interface FormFields {
  required: string[];
  optional: string[];
  custom_field: {
    enabled: boolean;
    label: string;
    type: string;
    options: string[];
  };
}

export interface Behavior {
  inactivity_timeout: number;
  auto_return_home: boolean;
  show_lead_count: boolean;
  collect_photo: boolean;
  admin_password?: string; // Senha de 4 dígitos para acesso ao admin
}

export interface Theme {
  colors: {
    [key: string]: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    text_secondary: string;
    success: string;
    error: string;
    button_primary_bg: string;
    button_primary_text: string;
    button_secondary_bg: string;
    button_secondary_text: string;
  };
  typography: {
    font_primary: string;
    font_secondary: string;
    heading_weight: string;
    body_weight: string;
  };
  logos: {
    main_logo_url: string;
    center_logo_url: string;
    watermark_url: string;
  };
  spacing: {
    border_radius: string;
    padding_base: string;
  };
}

export interface Content {
    welcome_title: string;
    welcome_subtitle: string;
    form_title: string;
    form_subtitle: string;
    thank_you_message: string;
    privacy_notice: string;
}

export interface TenantConfig {
  tenant_id: string;
  brand_name: string;
  theme: Theme;
  content: Content;
  games_config: GamesConfig;
  form_fields: FormFields;
  behavior: Behavior;
}

export interface LeadData {
    name: string;
    email: string;
    phone: string;
    consent: boolean;
    tenant_id: string;
    game_selected: string | null;
    timestamp: string;
    custom_field?: string;
}
