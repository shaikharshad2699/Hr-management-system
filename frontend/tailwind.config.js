/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7f5',
          100: '#d7ebe6',
          200: '#afd8cd',
          300: '#7dbfae',
          400: '#4b9e89',
          500: '#2c7f6c',
          600: '#236756',
          700: '#1d5346',
          800: '#19433a',
          900: '#173831',
        },
        ink: {
          50: '#f7f8f7',
          100: '#eef1ef',
          200: '#d9dfdc',
          300: '#b9c4bf',
          400: '#91a298',
          500: '#6f8277',
          600: '#58685f',
          700: '#48544d',
          800: '#3b4540',
          900: '#2f3733',
        },
      },
      boxShadow: {
        panel: '0 20px 45px -28px rgba(18, 38, 31, 0.34)',
        float: '0 28px 60px -34px rgba(18, 38, 31, 0.42)',
      },
      backgroundImage: {
        'mesh-soft': 'radial-gradient(circle at top left, rgba(44,127,108,0.16), transparent 42%), radial-gradient(circle at bottom right, rgba(125,191,174,0.16), transparent 36%)',
      },
    },
  },
  plugins: [],
}
