/**
 * JALRAKSHAK AI — Balanced Dual-Reference Industrial Colour System
 * 
 * Primary Foundation (Reference 1):
 * - #1C3C53: Deep muted navy-blue (main backgrounds, base foundation, navigation)
 * - #446882: Dusty steel-blue (cards, panels, secondary surfaces)
 * - #D2C1B7: Soft warm taupe (subtle accents, supporting elements, borders)
 * - #F8F3EF: Warm off-white (primary readable text, headings, crisp contrast)
 * 
 * Visual Accents (Reference 2):
 * - #0C2D74: Deep royal blue (structural equipment elements, deep bases)
 * - #0892C1: Rich ocean blue (secondary highlights, technical charts)
 * - #08C4E1: Vibrant cyan (interactive elements, flowing water, active controls)
 * - #F5E6BB: Soft pale yellow (contamination alerts, investigation highlights, warnings)
 */

export const PALETTE = {
  primaryDark: '#1C3C53',
  secondarySteel: '#446882',
  softTaupe: '#D2C1B7',
  warmOffWhite: '#F8F3EF',
  royalBlue: '#0C2D74',
  oceanBlue: '#0892C1',
  activeCyan: '#08C4E1',
  alertYellow: '#F5E6BB',
} as const;

export const BRAND_COLORS = {
  bg: '#1C3C53',
  panel: '#446882',
  active: '#08C4E1',
  tech: '#0892C1',
  taupe: '#D2C1B7',
  text: '#F8F3EF',
  alert: '#F5E6BB',
  royal: '#0C2D74',
} as const;

export const THEME_TOKENS = {
  dark: {
    bg: '#1C3C53',
    panel: '#446882',
    panelRaised: '#1C3C53',
    border: 'rgba(210, 193, 183, 0.25)',
    borderFocus: '#08C4E1',
    text: '#F8F3EF',
    textMuted: '#D2C1B7',
    flowHealthy: '#08C4E1',
    flowWarning: '#F5E6BB',
    structural: '#0C2D74',
    equipmentTrim: '#0892C1',
    alert: '#F5E6BB',
  },
} as const;

export type ThemeMode = 'dark' | 'light';
