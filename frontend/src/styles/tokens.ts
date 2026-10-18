/**
 * JALRAKSHAK AI — Strict Six-Colour Industrial Design System
 * 
 * The entire platform strictly uses ONLY these six approved colours:
 * - #086288: Primary dark structural colour (major backgrounds, navigation, infrastructure depth)
 * - #007979: Secondary dark teal (panels, structural surfaces, inactive infrastructure)
 * - #24B1B1: Primary interactive accent (flowing water, selected pipelines, buttons, active controls, sensor highlights)
 * - #78A4CB: Secondary technical accent (data visualization, charts, technical indicators)
 * - #95BDD7: Primary readable foreground colour (headings, labels, icons, important interface text)
 * - #D9D28B: Attention and investigation accent (contamination alerts, suspicious nodes, active investigations, sampling recommendations)
 */

export const PALETTE = {
  primaryDark: '#086288',
  secondaryTeal: '#007979',
  activeAccent: '#24B1B1',
  techAccent: '#78A4CB',
  foreground: '#95BDD7',
  alertAccent: '#D9D28B',
} as const;

export const BRAND_COLORS = {
  bg: '#086288',
  panel: '#007979',
  active: '#24B1B1',
  tech: '#78A4CB',
  text: '#95BDD7',
  alert: '#D9D28B',
} as const;

export const THEME_TOKENS = {
  dark: {
    bg: '#086288',
    panel: '#007979',
    panelRaised: '#086288',
    border: 'rgba(120, 164, 203, 0.25)',
    borderFocus: '#24B1B1',
    text: '#95BDD7',
    textMuted: '#78A4CB',
    flowHealthy: '#24B1B1',
    flowWarning: '#D9D28B',
    structural: '#007979',
    equipmentTrim: '#78A4CB',
    alert: '#D9D28B',
  },
} as const;

export type ThemeMode = 'dark' | 'light';
