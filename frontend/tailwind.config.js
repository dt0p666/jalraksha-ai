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
          dark: '#086288',
          teal: '#007979',
          active: '#24B1B1',
          tech: '#78A4CB',
          text: '#95BDD7',
          alert: '#D9D28B',
        },
        // Semantic mappings strictly from the 6 approved colors
        primary: {
          DEFAULT: '#24B1B1',
          dark: '#086288',
          light: '#95BDD7',
        },
        surface: {
          bg: '#086288',
          panel: '#007979',
          raised: '#086288',
          border: 'rgba(120, 164, 203, 0.25)',
        },
        status: {
          normal: '#24B1B1',
          warning: '#D9D28B',
          alert: '#D9D28B',
          tech: '#78A4CB',
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
