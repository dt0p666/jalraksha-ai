/**
 * Central design tokens for JALRAKSHAK AI.
 * The visual identity is strictly built from the user's uploaded 4-color palette:
 * - Yellow (#FDF4AF): Top band — alert banners, high-visibility badges, active step highlights, beacons
 * - Light Cyan / Mint (#A5E9DD): Second band — clean flowing pipes, sensor markers, telemetry glows, secondary cards
 * - Mid Teal / Sea Green (#6FBEB2): Third band — junctions, branch pipelines, safe states, borders
 * - Deep Teal / Forest Sea (#34908B): Bottom band — primary buttons, tanks/reservoirs, headers, prominent panels
 *
 * Dark backgrounds are derived cleanly from Deep Teal (#081416 / #0F2226 / #163238).
 * Light backgrounds use #FDF4AF and #EAF7F5.
 */

export const BRAND_COLORS = {
  yellow: '#FDF4AF',     // Band 1: Light Yellow / Cream
  lightCyan: '#A5E9DD',  // Band 2: Light Cyan / Aqua Mint
  midTeal: '#6FBEB2',    // Band 3: Mid Teal / Sea Green
  deepTeal: '#34908B',   // Band 4: Deep Teal / Forest Sea
  warning: '#FDF4AF',    // Yellow alert
  critical: '#FF5C5C',   // Red contamination alert
} as const;

export const THEME_TOKENS = {
  dark: {
    bg: '#081416',         // Clean deep teal-black canvas
    panel: '#0F2226',      // Deep teal panel surface
    panelRaised: '#163238', // Raised teal interactive surface
    border: 'rgba(111, 190, 178, 0.3)', // Mid teal outline
    borderFocus: '#A5E9DD',
    text: '#EAF7F5',       // Crisp pale seafoam text
    textMuted: '#A5E9DD',  // Mint secondary text
    flowHealthy: '#A5E9DD', // Healthy water glow
    reservoirFill: '#34908B',
    zoneFill: '#163238',
    zoneBorder: '#6FBEB2',
  },
  light: {
    bg: '#F6FBF9',         // Clean seafoam-white surface
    panel: '#FFFFFF',
    panelRaised: '#E2F3F0', // Soft mint raised
    border: 'rgba(52, 144, 139, 0.25)',
    borderFocus: '#34908B',
    text: '#081416',
    textMuted: '#34908B',
    flowHealthy: '#34908B',
    reservoirFill: '#34908B',
    zoneFill: '#E2F3F0',
    zoneBorder: '#6FBEB2',
  },
} as const;

export type ThemeMode = 'dark' | 'light';
