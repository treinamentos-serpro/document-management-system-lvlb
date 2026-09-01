/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#f3f0e8',
          50: '#fffdf8',
        },
        olive: {
          50: '#e4eee8',
          100: '#d9e6dd',
          200: '#c9d7ce',
          300: '#e0e7e1',
          400: '#99b1a4',
          500: '#71827a',
          600: '#60746b',
          700: '#50665c',
          800: '#365a4b',
          900: '#18302b',
        },
        terracotta: {
          50: '#f8ddd4',
          100: '#e9c6bb',
          400: '#bd593e',
          500: '#a94831',
          600: '#99452f',
          700: '#813523',
          800: '#7d3325',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

