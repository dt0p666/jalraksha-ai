/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#3368A0',   // Deep Blue (Band 1)
          sky: '#66A3BF',    // Ocean Blue (Band 2)
          olive: '#C8DFDB',  // Pale Mint (Band 3)
          sage: '#F2EFE7',   // Warm Sand (Band 4)
          yellow: '#FDF4AF',
        },
        status: {
          warning: '#FDF4AF',
          critical: '#FF5C5C',
          safe: '#66A3BF',
        },
        dark: {
          bg: '#0F1E2E',
          panel: '#162C42',
          raised: '#1E3B57',
          border: 'rgba(102, 163, 191, 0.3)',
          text: '#F2EFE7',
          muted: '#C8DFDB',
        },
        light: {
          bg: '#F2EFE7',
          panel: '#FFFFFF',
          raised: '#C8DFDB',
          border: 'rgba(51, 104, 160, 0.25)',
          text: '#0F1E2E',
          muted: '#3368A0',
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'panel': '12px',
        'card': '8px',
      },
      keyframes: {
        flow: { '0%': { strokeDashoffset: '24' }, '100%': { strokeDashoffset: '0' } },
        marquee: { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-50%)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        pulseRing: { '0%, 100%': { opacity: '0.4', transform: 'scale(1)' }, '50%': { opacity: '1', transform: 'scale(1.08)' } },
      },
      animation: {
        flow: 'flow 2s linear infinite',
        marquee: 'marquee 25s linear infinite',
        fadeIn: 'fadeIn 0.2s ease-out',
        'pulse-ring': 'pulseRing 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
