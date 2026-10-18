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
  yellow: '#FDF4AF', // Warm Solar Light / Highlights / Sensor beacons / Peak Alert
  sky: '#A5E9DD',    // Aquamarine / Flowing Water / Active telemetry / Healthy state
  teal: '#6FBEB2',   // Medium Teal / Pipeline junctions / Sub-sectors
  deepTeal: '#34908B', // Deep Marine Cyan / Primary tanks / Main brand
  warning: '#FDF4AF', // High-contrast solar yellow alert
  critical: '#FF5C5C', // Clear crimson alarm
} as const;

export const THEME_TOKENS = {
  dark: {
    bg: '#080E18',         // Deep obsidian navy from reference slide
    panel: '#0D1626',      // Midnight tech panel
    panelRaised: '#14223B', // Raised dark console
    border: 'rgba(111, 190, 178, 0.25)', // Subtle cyan wireframe border
    borderFocus: '#A5E9DD',
    text: '#E8F8F5',       // Crisp bright white-mint
    textMuted: '#7E9EB0',  // Muted tech cyan-gray
    flowHealthy: '#A5E9DD', // Flowing glowing water
    reservoirFill: '#34908B',
    zoneFill: '#1B383D',
    zoneBorder: '#6FBEB2',
  },
  light: {
    bg: '#F2FAF8',
    panel: '#FFFFFF',
    panelRaised: '#E3F4F1',
    border: 'rgba(52, 144, 139, 0.22)',
    borderFocus: '#34908B',
    text: '#0C2022',
    textMuted: '#426868',
    flowHealthy: '#34908B',
    reservoirFill: '#34908B',
    zoneFill: '#A5E9DD',
    zoneBorder: '#6FBEB2',
  },
} as const;

export type ThemeMode = 'dark' | 'light';
