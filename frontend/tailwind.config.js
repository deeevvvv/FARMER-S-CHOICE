/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        forest: {
          50: "#F1F8F2",
          100: "#E2F1E4",
          200: "#C6E4CA",
          300: "#9BCFA3",
          400: "#6FBA7B",
          500: "#2E9148",
          600: "#237A3A",
          700: "#19632F",
          800: "#104D25",
          900: "#093A1B",
        },

        leaf: {
          50: "#F3FAF4",
          100: "#E8F5E9",
          200: "#D2EBD5",
          300: "#A9D5AF",
          400: "#72B97D",
          500: "#16833B",
          600: "#117331",
          700: "#0B5D2A",
          800: "#084B22",
          900: "#063C1B",
        },

        paper: "#F5FAF6",
        ink: "#18231B",

        primary: "#16833B",
        "primary-dark": "#0B5D2A",
        "primary-light": "#E8F5E9",

        success: "#16833B",
        danger: "#C62828",
        warning: "#B7791F",
      },

      fontFamily: {
        body: [
          "Manrope",
          "sans-serif",
        ],

        display: [
          "Manrope",
          "sans-serif",
        ],

        mono: [
          "JetBrains Mono",
          "monospace",
        ],
      },

      boxShadow: {
        "green-sm":
          "0 1px 8px rgba(22, 131, 59, 0.08)",

        "green-md":
          "0 4px 16px rgba(22, 131, 59, 0.12)",

        "green-lg":
          "0 10px 30px rgba(22, 131, 59, 0.16)",
      },

      borderRadius: {
        "4xl": "2rem",
      },
    },
  },

  plugins: [],
};