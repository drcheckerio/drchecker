import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ahrefs: {
          orange: "#FF7524",
          "orange-light": "#FF8F4D",
          "orange-dark": "#E85F0E",
          dark: "#1E1E1E",
          darker: "#161616",
          navy: "#303C55",
          "navy-light": "#3D4C6B",
          "navy-dark": "#252F45",
        },
        dr: {
          poor: "#EF4444",
          fair: "#F59E0B",
          good: "#3B82F6",
          excellent: "#22C55E",
        },
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(255,117,36,0.12) 0%, transparent 70%)",
        "orange-gradient": "linear-gradient(135deg, #FF7524 0%, #E85F0E 100%)",
        "navy-gradient": "linear-gradient(135deg, #303C55 0%, #252F45 100%)",
      },
      boxShadow: {
        "orange-glow": "0 0 24px rgba(255,117,36,0.35)",
        "orange-glow-lg": "0 0 40px rgba(255,117,36,0.5)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-soft": "pulseSoft 2.5s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        pulseSoft: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.75" } },
        shimmer: { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
