/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      height: {
        '25': '6.25rem',
      },
      gridTemplateRows: {
        'layout': '64px 1fr 100px',
      },
    },
  },
  plugins: [],
};



