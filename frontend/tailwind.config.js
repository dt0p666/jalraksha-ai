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
          blue: '#34908B',   // Deep marine cyan
          sky: '#A5E9DD',    // Aquamarine / Flowing water
          olive: '#6FBEB2',  // Medium teal
          sage: '#FDF4AF',   // Solar yellow
          yellow: '#FDF4AF',
        },
        status: {
          warning: '#FDF4AF',
          critical: '#FF5C5C',
          safe: '#A5E9DD',
        },
        dark: {
          bg: '#080E18',
          panel: '#0D1626',
          raised: '#14223B',
          border: 'rgba(111, 190, 178, 0.25)',
          text: '#E8F8F5',
          muted: '#7E9EB0',
        },
        light: {
          bg: '#F2FAF8',
          panel: '#FFFFFF',
          raised: '#E3F4F1',
          border: 'rgba(52, 144, 139, 0.22)',
          text: '#0C2022',
          muted: '#426868',
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
