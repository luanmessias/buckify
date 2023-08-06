/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,tsx,vue}'],
  theme: {
    extend: {
      fontSize: {
        xxs: ['0.625rem', { lineHeight: '0.875rem' }]
      },
      colors: {
        white: '#ffffff',
        black: {
          50: '#E6E6E6',
          100: '#B0B0B0',
          200: '#8A8A8A',
          300: '#545454',
          400: '#333333',
          500: '#000000'
        },
        success: {
          50: '#EAF8EE',
          100: '#BEE9CC',
          200: '#9EDEB3',
          300: '#72CF90',
          400: '#56C67A',
          500: '#2CB859',
          600: '#28A751',
          700: '#1F833F',
          800: '#186531',
          900: '#124D25'
        },
        warning: {
          50: '#FDF9ED',
          100: '#F8EDC6',
          200: '#F5E5AB',
          300: '#F1D984',
          400: '#EED16D',
          500: '#EAC648',
          600: '#D5B442',
          700: '#A68D33',
          800: '#816D28',
          900: '#62531E'
        },
        danger: {
          50: '#FDEEEE',
          100: '#F8CBCB',
          200: '#F4B2B2',
          300: '#EF8F8F',
          400: '#EC7979',
          500: '#E75858',
          600: '#D25050',
          700: '#A43E3E',
          800: '#7F3030',
          900: '#612525'
        },
        neutral: {
          50: '#EAECED',
          100: '#BEC3C7',
          200: '#9FA6AC',
          300: '#737E86',
          400: '#58656F',
          500: '#2E3E4B',
          600: '#2A3844',
          700: '#212C35',
          800: '#192229',
          900: '#131A20'
        },
        primary: {
          50: '#EDF7F4',
          100: '#C8E6DE',
          200: '#AEDACE',
          300: '#89C9B7',
          400: '#72BFA9',
          500: '#4FAF94',
          600: '#489F87',
          700: '#387C69',
          800: '#2B6051',
          900: '#214A3E'
        },
        secondary: {
          50: '#F4F8F7',
          100: '#DCEBE7',
          200: '#CBE1DB',
          300: '#B3D3CA',
          400: '#A5CAC0',
          500: '#8EBDB0',
          600: '#81ACA0',
          700: '#65867D',
          800: '#4E6861',
          900: '#3C4F4A'
        }
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Roboto Slab', 'serif']
      }
    }
  },
  plugins: []
}

