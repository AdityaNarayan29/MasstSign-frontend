/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#000",
          foreground: "#ffffff",
        },
        background: {
          DEFAULT: "#000",
        },
        muted: {
          DEFAULT: "#000",
        },
      },
    },
  },
  plugins: [],
};
