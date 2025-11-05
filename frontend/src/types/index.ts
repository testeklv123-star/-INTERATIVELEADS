export interface TenantConfig {
  form_settings: {
    fields: Array<{
      id: string;
      label: string;
      type: string;
      required: boolean;
      options?: string[];
    }>;
  };
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent?: string;
    };
    logos: {
      main: string;
      secondary?: string;
    };
  };
}
