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
        night: {
          bg: "#0A1024",
          surface: "#121A35",
          raised: "#172145",
          line: "#26305A",
          ink: "#F5F1E8",
          soft: "#C6CCDC",
          mute: "#7A8499",
        },
        tone: {
          danger: "#EF5A5A",
          warn: "#FF6600",
          info: "#5B9DFF",
          good: "#39D08E",
        },
      },
      borderRadius: {
        "2xl": "16px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(5, 25, 51, 0.06)",
        cta: "0 8px 24px rgba(255, 102, 0, 0.22)",
        editorial: "0 24px 60px rgba(2, 5, 18, 0.55)",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "var(--font-serif)",
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "Times",
          "serif",
        ],
      },
      letterSpacing: {
        kicker: "0.18em",
      },
    },
  },
  plugins: [],
};

export default config;
