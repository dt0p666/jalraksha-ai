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
          yellow: '#FDF4AF',    // Band 1: Light Yellow
          lightCyan: '#A5E9DD', // Band 2: Light Cyan / Aqua
          midTeal: '#6FBEB2',   // Band 3: Mid Teal
          deepTeal: '#34908B',  // Band 4: Deep Teal
        },
        status: {
          warning: '#FDF4AF',
          critical: '#FF5C5C',
          safe: '#6FBEB2',
        },
        dark: {
          bg: '#081416',
          panel: '#0F2226',
          raised: '#163238',
          border: 'rgba(111, 190, 178, 0.3)',
          text: '#EAF7F5',
          muted: '#A5E9DD',
        },
        light: {
          bg: '#F6FBF9',
          panel: '#FFFFFF',
          raised: '#E2F3F0',
          border: 'rgba(52, 144, 139, 0.25)',
          text: '#081416',
          muted: '#34908B',
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
