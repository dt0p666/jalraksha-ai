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
          bg: '#071018',
          secondary: '#0D1B26',
          raised: '#132535',
          cyan: '#38D9E6',
          aquamarine: '#64F4C4',
          warning: '#FFB547',
          critical: '#FF5E66',
          text: '#EAF4F7',
          muted: '#8EA5B4',
        },
        status: {
          warning: '#FFB547',
          critical: '#FF5E66',
          safe: '#64F4C4',
          cyan: '#38D9E6',
        },
        dark: {
          bg: '#071018',
          panel: '#0D1B26',
          raised: '#132535',
          border: 'rgba(56, 217, 230, 0.2)',
          text: '#EAF4F7',
          muted: '#8EA5B4',
        },
        light: {
          bg: '#F3F7FA',
          panel: '#FFFFFF',
          raised: '#E3EDF4',
          border: 'rgba(13, 27, 38, 0.15)',
          text: '#071018',
          muted: '#4B6375',
        }
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
        marquee: { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-50%)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        pulseRing: { '0%, 100%': { opacity: '0.3', transform: 'scale(1)' }, '50%': { opacity: '0.8', transform: 'scale(1.08)' } },
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
