import type { Config } from "tailwindcss";

/**
 * BİYOBİLİM — Tasarım Sistemi
 * Bu dosya, statik prototipte kullanılan renk/tipografi/aralık dilini
 * Tailwind design token'larına dönüştürür. Tüm bileşenler bu token'ları kullanır;
 * hiçbir yerde ham hex kod veya keyfi piksel değeri kullanılmamalıdır.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        blue: {
          deep: "#123A63",
          DEFAULT: "#175488",
          bright: "#2E7BC4",
        },
        green: {
          DEFAULT: "#3F7D52",
          soft: "#8FB89B",
        },
        bg: {
          DEFAULT: "#F6F7F9",
          alt: "#EFF2F0",
        },
        ink: {
          DEFAULT: "#232629",
          muted: "#5C6167",
        },
        line: "#DADEE1",
        paper: "#FCFCFA",
        amber: "#B8863B",
        red: "#B24B3F",
      },
      fontFamily: {
        head: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        tag: ["var(--font-source-serif)", "serif"],
      },
      borderRadius: {
        DEFAULT: "3px",
        sm: "2px",
        md: "4px",
        lg: "6px",
        full: "9999px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      boxShadow: {
        card: "0 24px 40px -28px rgba(18, 58, 99, 0.4)",
        modal: "0 40px 90px -30px rgba(0, 0, 0, 0.5)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(26px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) forwards",
        "fade-in": "fade-in 0.6s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
