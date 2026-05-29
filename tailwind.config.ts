import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bone: "#FAF8F5",
        ink: "#15130F",
        rosso: {
          50: "#FBEEEE",
          100: "#F4D2D2",
          200: "#E5A2A2",
          300: "#D26C6C",
          400: "#BF4848",
          500: "#A8302E",
          600: "#8E2422",
          700: "#71211F",
          800: "#561C1B",
          900: "#3F1817"
        },
        basilico: {
          50: "#EDF3EE",
          100: "#D2E1D5",
          200: "#A6C3AC",
          300: "#7AA384",
          400: "#5A8765",
          500: "#3F6B4D",
          600: "#2F543C",
          700: "#244430",
          800: "#1B3525",
          900: "#13261B"
        }
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-geist)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"]
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem"
      }
    }
  },
  plugins: []
};

export default config;
