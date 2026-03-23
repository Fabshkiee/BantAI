/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Semantic Colors (Mapped from global.css)
      colors: {
        text: {
          default: "var(--color-black-500)",
          subtle: "var(--color-gray-500)",
          primary: "var(--color-blue-500)",
          inverse: "var(--color-white-100)",
          critical: "var(--color-red-500)",
          low: "var(--color-green-500)",
          medium: "var(--color-yellow-500)",
          high: "var(--color-orange-500)",
        },
        surface: {
          default: "var(--color-white-100)",
          primary: "var(--color-blue-500)",
          secondary: "var(--color-blue-400)",
          light: "var(--color-blue-100)",
          focus: "var(--color-blue-700)",
          red: "var(--color-red-300)",
          green: "var(--color-green-300)",
          yellow: "var(--color-yellow-300)",
          orange: "var(--color-orange-300)",
          critical: "var(--color-red-500)",
          low: "var(--color-green-500)",
          medium: "var(--color-yellow-500)",
          high: "var(--color-orange-500)",
        },
        border: {
          default: "var(--color-gray-500)",
          inverse: "var(--color-white-100)",
          secondary: "var(--color-gray-50)",
          primary: "var(--color-blue-500)",
          critical: "var(--color-red-500)",
          low: "var(--color-green-500)",
          medium: "var(--color-yellow-500)",
          high: "var(--color-orange-500)",
        },
      },

      fontFamily: {
        display: ["Roboto", "sans-serif"],
        text: ["Inter", "sans-serif"],
      },
      fontSize: {
        sm: "12px",
        md: "14px",
        lg: "16px",
        h3: "24px",
        h2: "30px",
        h1: "40px",
      },
    },
  },
  plugins: [],
};
