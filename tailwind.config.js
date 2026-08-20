/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        surface: '#FFFFFF',
        border: '#E5E7EB',
        accent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
          ring: 'rgba(37, 99, 235, 0.25)',
        },
        primary: '#18181B',
        secondary: '#71717A',
        status: {
          optimal: {
            bg: '#F0FDF4',
            text: '#166534',
            border: '#BBF7D0',
          },
          low: {
            bg: '#FFFBEB',
            text: '#92400E',
            border: '#FDE68A',
          },
          out: {
            bg: '#FEF2F2',
            text: '#991B1B',
            border: '#FECACA',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
