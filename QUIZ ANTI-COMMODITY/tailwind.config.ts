import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#FFFFFF",
          ink: "#051933",
          accent: "#FF6600",
          slate: "#1F2937",
          soft: "#F7F8FA",
          line: "#E5E7EB",
          mute: "#6B7280",
        },
      },
      borderRadius: {
        "2xl": "16px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(5, 25, 51, 0.06)",
        cta: "0 8px 24px rgba(255, 102, 0, 0.22)",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
