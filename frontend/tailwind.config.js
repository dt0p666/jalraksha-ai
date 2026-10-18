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
          blue: '#425B9A',
          sky: '#76C0EC',
          olive: '#597928',
          sage: '#91AC67',
        },
        status: {
          warning: '#E8A33D',
          critical: '#D9534F',
          safe: '#91AC67',
        },
        dark: {
          bg: '#0D1630',
          panel: '#141E3D',
          raised: '#1D2A52',
          border: 'rgba(66, 91, 154, 0.35)',
          text: '#EAF1F8',
          muted: '#9FB0C9',
        },
        light: {
          bg: '#F3F7FB',
          panel: '#FFFFFF',
          raised: '#EBF2F9',
          border: 'rgba(66, 91, 154, 0.2)',
          text: '#14203F',
          muted: '#5A6B85',
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
