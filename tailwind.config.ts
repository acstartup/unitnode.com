import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3A8EFF",   // Main brand blue (light mode)
          light: "#E6F0FF",
          dark: "#1F66CC",
          darkmode: "#5A8DE0",
        },
        secondary: {
          DEFAULT: "#F97316",
          light: "#FFECE0",
          darkmode: "#FBAF59",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#1F2937",
          800: "#111827",
          900: "#0F172A",
        },
        success: {
          DEFAULT: "#10B981",
          darkmode: "#0F9D58",
        },
        error: {
          DEFAULT: "#EF4444",
          darkmode: "#B91C1C",
        }
      },
      fontFamily: {
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;