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
        craft: {
          bg: '#0e1310',
          panel: '#131914',
          card: '#161f18',
          border: '#263428',
          'border-light': '#364839',
          gold: '#f5a623',
          'gold-dark': '#b97a15',
          neonGreen: '#3ee087',
          neonPink: '#f43f8e',
          neonCyan: '#06b6d4',
          textMuted: '#7f9483',
          textMain: '#c7d5c5',
          textBright: '#eaf4e7'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Space Mono"', '"Fira Code"', 'monospace'],
        display: ['"VT323"', '"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
