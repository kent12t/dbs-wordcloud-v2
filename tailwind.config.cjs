/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/index.html", "./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dbs: {
          bg: "#111111",
          surface: "#1F1F1F",
          border: "#2D2D2D",
          red: "#E2231A",
          text: "#FFFFFF",
          muted: "#9CA3AF"
        }
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
