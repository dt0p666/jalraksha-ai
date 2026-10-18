/**
 * Central design tokens for JALRAKSHAK AI.
 * Defined in ONE place per project guidelines.
 */

export const BRAND_COLORS = {
  blue: '#425B9A',
  sky: '#76C0EC',
  olive: '#597928',
  sage: '#91AC67',
  warning: '#E8A33D',
  critical: '#D9534F',
} as const;

export const THEME_TOKENS = {
  dark: {
    bg: '#0D1630',
    panel: '#141E3D',
    panelRaised: '#1D2A52',
    border: 'rgba(66, 91, 154, 0.35)',
    borderFocus: '#76C0EC',
    text: '#EAF1F8',
    textMuted: '#9FB0C9',
    flowHealthy: '#76C0EC',
    reservoirFill: '#425B9A',
    zoneFill: '#597928',
    zoneBorder: '#91AC67',
  },
  light: {
    bg: '#F3F7FB',
    panel: '#FFFFFF',
    panelRaised: '#EBF2F9',
    border: 'rgba(66, 91, 154, 0.20)',
    borderFocus: '#425B9A',
    text: '#14203F',
    textMuted: '#5A6B85',
    flowHealthy: '#425B9A',
    reservoirFill: '#425B9A',
    zoneFill: '#91AC67',
    zoneBorder: '#597928',
  },
} as const;

export type ThemeMode = 'dark' | 'light';
