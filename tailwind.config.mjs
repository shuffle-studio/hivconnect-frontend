/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Deep Teal — calming, healthcare-associated, trustworthy
        primary: {
          50:  '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',  // Decorative — 3.75:1 (AA large text, UI components)
          700: '#0F766E',  // Buttons & text — 5.47:1 (AA all text) ← PRIMARY ACTION
          800: '#115E59',  // Hover states — 8.06:1 (AAA)
          900: '#134E4A',
        },
        // Warm Coral/Orange — human warmth, inviting, approachable
        secondary: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',  // Decorative — 3.56:1
          700: '#C2410C',  // Buttons & text — 5.18:1 (AA) ← SECONDARY ACTION
          800: '#9A3412',
          900: '#7C2D12',
        },
        // Warm Gold — highlights, featured items
        accent: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',  // 4.87:1 vs white (AA)
          800: '#92400E',
          900: '#78350F',
        },
        // Success
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
        },
        // Warning
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        // Error — RED STAYS RED for actual crisis/emergency elements only
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Source Serif 4', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      minHeight: {
        'screen-safe': 'calc(100vh - 4rem)',
      }
    },
  },
  plugins: [],
}
