import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        "Inter",
        "Segoe UI",
        "Aptos",
        "Helvetica Neue",
        "Arial",
        "sans-serif"
      ],
      mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
    },
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        muted: "var(--muted)",
        "muted-strong": "var(--muted-strong)",
        line: "var(--line)",
        "line-soft": "var(--line-soft)",
        brand: "var(--brand)",
        "brand-strong": "var(--brand-strong)",
        accent: "var(--accent)",
        cyan: "var(--cyan)",
        danger: "var(--danger)",
        success: "var(--success)",
        warning: "var(--warning)",
        "sidebar-bg": "var(--sidebar-bg)",
        "sidebar-pill": "var(--sidebar-pill)"
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        panel: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
        menu: "0 14px 30px rgba(15, 23, 42, 0.14)",
        dialog: "0 24px 48px rgba(15, 23, 42, 0.18)"
      },
      borderRadius: {
        soft: "10px",
        menu: "14px",
        panel: "18px",
        dialog: "22px"
      },
      backgroundImage: {
        "grad-brand": "var(--grad-brand)",
        "grad-brand-soft": "var(--grad-brand-soft)",
        "grad-accent": "var(--grad-accent)",
        "grad-aurora": "var(--grad-aurora)"
      }
    }
  },
  plugins: []
};

export default config;
