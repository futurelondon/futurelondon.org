/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.html"],
  theme: {
    extend: {
      colors: {
        brand: "rgb(53,32,101)",
      },
      fontFamily: {
        header: ["Staatliches"],
        title: ["Pixelify Sans"],
      },
    },
  },
  plugins: [],
};
