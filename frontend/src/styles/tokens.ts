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
  deepBlue: '#3368A0',   // Primary brand blue (Band 1) - buttons, reservoirs, headers
  oceanBlue: '#66A3BF',  // Mid cyan blue (Band 2) - active flow, sensors, links
  paleTeal: '#C8DFDB',   // Soft pale mint/teal (Band 3) - cards, tags, safe states
  warmSand: '#F2EFE7',   // Cream / warm sand (Band 4) - light surface, text, clean cards
  warning: '#FDF4AF',    // High-visibility alert
  critical: '#FF5C5C',   // Contamination confirmed
} as const;

export const THEME_TOKENS = {
  dark: {
    bg: '#0F1E2E',         // Clean oceanic navy derived from #3368A0 (warm, inviting, not muddy)
    panel: '#162C42',      // Crisp deep blue panel
    panelRaised: '#1E3B57', // Raised interactive blue surface
    border: 'rgba(102, 163, 191, 0.3)', // Cyan-blue outline from #66A3BF
    borderFocus: '#66A3BF',
    text: '#F2EFE7',       // Warm sand text (crisp, readable, WCAG AAA)
    textMuted: '#C8DFDB',  // Pale mint secondary text
    flowHealthy: '#66A3BF', // Vibrant water glow
    reservoirFill: '#3368A0',
    zoneFill: '#1E3B57',
    zoneBorder: '#66A3BF',
  },
  light: {
    bg: '#F2EFE7',         // Warm sand surface from Band 4
    panel: '#FFFFFF',
    panelRaised: '#C8DFDB', // Soft pale mint from Band 3
    border: 'rgba(51, 104, 160, 0.25)',
    borderFocus: '#3368A0',
    text: '#0F1E2E',
    textMuted: '#3368A0',
    flowHealthy: '#3368A0',
    reservoirFill: '#3368A0',
    zoneFill: '#C8DFDB',
    zoneBorder: '#66A3BF',
  },
} as const;

export type ThemeMode = 'dark' | 'light';
