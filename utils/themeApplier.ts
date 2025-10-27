
import { Theme } from '../types';

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (!root) return;

  // Apply colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVarName = `--color-${key.replace(/_/g, '-')}`;
    root.style.setProperty(cssVarName, value);
  });

  // Apply typography
  root.style.setProperty('--font-primary', theme.typography.font_primary);
  root.style.setProperty('--font-secondary', theme.typography.font_secondary);
  root.style.setProperty('--heading-weight', theme.typography.heading_weight);
  root.style.setProperty('--body-weight', theme.typography.body_weight);

  // Apply spacing
  root.style.setProperty('--border-radius', theme.spacing.border_radius);
  root.style.setProperty('--padding-base', theme.spacing.padding_base);

  // Load Google Fonts
  loadGoogleFonts([theme.typography.font_primary, theme.typography.font_secondary]);
}

export function loadGoogleFonts(fonts: string[]) {
  const uniqueFonts = [...new Set(fonts)];
  const fontString = uniqueFonts.map(f => `family=${f.replace(/ /g, '+')}`).join('&');
  
  const existingLink = document.head.querySelector(`link[href*="https://fonts.googleapis.com/css2"]`);
  if (existingLink) {
    document.head.removeChild(existingLink);
  }

  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?${fontString}&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}
