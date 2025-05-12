// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#18181b",
        secondary: "#27272a",
        accent: "#1db954", // Vert Spotify
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};