import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        "Segoe UI",
        "Aptos",
        "Trebuchet MS",
        "Helvetica Neue",
        "Arial",
        "sans-serif"
      ]
    },
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        brand: "var(--brand)",
        "brand-strong": "var(--brand-strong)",
        danger: "var(--danger)",
        "sidebar-bg": "var(--sidebar-bg)",
        "sidebar-pill": "var(--sidebar-pill)"
      },
      boxShadow: {
        panel: "var(--shadow-sm)",
        menu: "0 14px 30px rgba(6, 29, 17, 0.12)",
        dialog: "0 24px 48px rgba(12, 34, 56, 0.18)"
      },
      borderRadius: {
        soft: "10px",
        menu: "12px",
        panel: "16px",
        dialog: "18px"
      }
    }
  },
  plugins: []
};

export default config;
