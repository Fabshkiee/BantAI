/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Semantic Colors (Hardcoded with Hex for React Native Mobile compatibility)
      colors: {
        text: {
          default: "#000000",
          subtle: "#84888c",
          primary: "#006ec2",
          inverse: "#f5faff",
          critical: "#b40000",
          low: "#00ad14",
          medium: "#d89700",
          high: "#c56400",
        },
        surface: {
          default: "#f5faff",
          primary: "#006ec2",
          secondary: "#54a9ea",
          light: "#f0f8ff",
          focus: "#005da3",
          red: "#dd9797",
          green: "#aeffb7",
          yellow: "#fdffce",
          orange: "#ffd6ad",
          critical: "#b40000",
          low: "#00ad14",
          medium: "#d89700",
          high: "#c56400",
        },
        border: {
          default: "#84888c",
          inverse: "#f5faff",
          secondary: "#e5e5e5",
          primary: "#006ec2",
          critical: "#b40000",
          low: "#00ad14",
          medium: "#d89700",
          high: "#c56400",
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
