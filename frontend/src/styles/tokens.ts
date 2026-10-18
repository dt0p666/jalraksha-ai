/**
 * JALRAKSHAK AI — New Mission Control & Digital Twin Visual Identity Tokens
 * 
 * Palette:
 * - Background: #071018
 * - Secondary background: #0D1B26
 * - Surface Raised: #132535
 * - Primary cyan: #38D9E6
 * - Aquamarine: #64F4C4
 * - Warning amber: #FFB547
 * - Contamination red: #FF5E66
 * - Primary text: #EAF4F7
 * - Secondary text: #8EA5B4
 */

export const BRAND_COLORS = {
  bg: '#071018',
  secondaryBg: '#0D1B26',
  raisedBg: '#132535',
  cyan: '#38D9E6',
  aquamarine: '#64F4C4',
  warning: '#FFB547',
  critical: '#FF5E66',
  text: '#EAF4F7',
  textSecondary: '#8EA5B4',
} as const;

export const THEME_TOKENS = {
  dark: {
    bg: '#071018',
    panel: '#0D1B26',
    panelRaised: '#132535',
    border: 'rgba(56, 217, 230, 0.2)',
    borderFocus: '#38D9E6',
    text: '#EAF4F7',
    textMuted: '#8EA5B4',
    flowHealthy: '#38D9E6',
    reservoirFill: '#38D9E6',
    zoneFill: '#0D1B26',
    zoneBorder: '#132535',
    warning: '#FFB547',
    critical: '#FF5E66',
  },
  light: {
    bg: '#F3F7FA',
    panel: '#FFFFFF',
    panelRaised: '#E3EDF4',
    border: 'rgba(13, 27, 38, 0.15)',
    borderFocus: '#0284C7',
    text: '#071018',
    textMuted: '#4B6375',
    flowHealthy: '#0284C7',
    reservoirFill: '#0284C7',
    zoneFill: '#E3EDF4',
    zoneBorder: '#B0C9D9',
    warning: '#D97706',
    critical: '#DC2626',
  },
} as const;

export type ThemeMode = 'dark' | 'light';
