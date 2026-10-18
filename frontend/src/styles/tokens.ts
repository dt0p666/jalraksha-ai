/**
 * Central design tokens for JALRAKSHAK AI.
 * The visual identity is strictly built from the four brand colors:
 * - Blue: #425B9A (main brand identity, primary controls, tanks, headers)
 * - Sky: #76C0EC (water, healthy flow, glow, focus rings, links)
 * - Olive: #597928 (village lands, darker fills, secondary accents)
 * - Sage: #91AC67 (supply zones, safe states, terrain, advisory accents)
 * Alerts strictly use soft amber (#E8A33D) and brick red (#D9534F).
 * Neutral grays are tinted from brand blue.
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
    bg: '#0E1733',
    panel: '#152248',
    panelRaised: '#1E2F62',
    border: 'rgba(66, 91, 154, 0.38)',
    borderFocus: '#76C0EC',
    text: '#EAF1F8',
    textMuted: '#9FB0C9',
    flowHealthy: '#76C0EC',
    reservoirFill: '#425B9A',
    zoneFill: '#597928',
    zoneBorder: '#91AC67',
  },
  light: {
    bg: '#F3F6FA',
    panel: '#FFFFFF',
    panelRaised: '#E8F0FA',
    border: 'rgba(66, 91, 154, 0.22)',
    borderFocus: '#425B9A',
    text: '#121D38',
    textMuted: '#485B7D',
    flowHealthy: '#425B9A',
    reservoirFill: '#425B9A',
    zoneFill: '#91AC67',
    zoneBorder: '#597928',
  },
} as const;

export type ThemeMode = 'dark' | 'light';
