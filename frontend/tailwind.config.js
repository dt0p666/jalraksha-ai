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
          navy: '#1C3C53',
          steel: '#446882',
          taupe: '#D2C1B7',
          white: '#F8F3EF',
          royal: '#0C2D74',
          ocean: '#0892C1',
          cyan: '#08C4E1',
          yellow: '#F5E6BB',
          // Aliases for compatibility
          dark: '#1C3C53',
          teal: '#446882',
          active: '#08C4E1',
          tech: '#0892C1',
          text: '#F8F3EF',
          alert: '#F5E6BB',
        },
        primary: {
          DEFAULT: '#08C4E1',
          dark: '#1C3C53',
          light: '#F8F3EF',
        },
        surface: {
          bg: '#1C3C53',
          panel: '#446882',
          raised: '#1C3C53',
          border: 'rgba(210, 193, 183, 0.25)',
        },
        status: {
          normal: '#08C4E1',
          warning: '#F5E6BB',
          alert: '#F5E6BB',
          tech: '#0892C1',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'panel': '12px',
        'card': '8px',
      },
      keyframes: {
        flow: { '0%': { strokeDashoffset: '24' }, '100%': { strokeDashoffset: '0' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        pulseRing: { '0%, 100%': { opacity: '0.3', transform: 'scale(1)' }, '50%': { opacity: '0.8', transform: 'scale(1.08)' } },
      },
      animation: {
        flow: 'flow 2s linear infinite',
        fadeIn: 'fadeIn 0.2s ease-out',
        'pulse-ring': 'pulseRing 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
