import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0a0a0c",
          light: "#f8fafc",
        },
        card: {
          DEFAULT: "#111827",
          elevated: "#16161a",
          light: "#ffffff",
        },
        accent: {
          purple: "#9333ea",
          pink: "#db2777",
          green: "#22c55e",
          blue: "#3b82f6",
          cyan: "#06b6d4",
        },
        text: {
          primary: "#ffffff",
          secondary: "#94a3b8",
          muted: "#64748b",
          dark: "#0f172a",
        },
        border: {
          subtle: "rgba(255,255,255,0.08)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(to right, #9333ea, #c026d3, #db2777)",
        "gradient-radial-purple":
          "radial-gradient(ellipse at center, rgba(147,51,234,0.15) 0%, transparent 70%)",
        "gradient-radial-blue":
          "radial-gradient(ellipse at center, rgba(59,130,246,0.1) 0%, transparent 70%)",
        shimmer:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(147, 51, 234, 0.3)",
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.3)",
        card: "0 1px 0 0 rgba(255,255,255,0.05) inset",
      },
    },
  },
  plugins: [],
};

export default config;
