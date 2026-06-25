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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Brand colors
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.05)",
          hover: "rgba(255,255,255,0.08)",
          border: "rgba(255,255,255,0.1)",
          light: "rgba(255,255,255,0.7)",
          "light-hover": "rgba(255,255,255,0.85)",
          "light-border": "rgba(0,0,0,0.08)",
        },
        dr: {
          poor: "#ef4444",
          fair: "#f59e0b",
          good: "#3b82f6",
          excellent: "#22c55e",
        },
      },
      backgroundImage: {
        "dark-base": "radial-gradient(ellipse at top, #0f1629 0%, #080C14 50%, #050810 100%)",
        "light-base": "radial-gradient(ellipse at top, #eef2ff 0%, #f8faff 50%, #f0f4ff 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
        "brand-gradient": "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
        "hero-glow": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.15) 0%, transparent 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        "glass-hover": "0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
        "brand-glow": "0 0 30px rgba(99,102,241,0.3)",
        "card-light": "0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "excellent-glow": "0 0 20px rgba(34,197,94,0.3)",
        "good-glow": "0 0 20px rgba(59,130,246,0.3)",
        "fair-glow": "0 0 20px rgba(245,158,11,0.3)",
        "poor-glow": "0 0 20px rgba(239,68,68,0.3)",
      },
      backdropBlur: {
        glass: "12px",
        "glass-lg": "20px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(99,102,241,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(99,102,241,0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Cal Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
