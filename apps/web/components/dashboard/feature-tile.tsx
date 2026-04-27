import Link from "next/link";
import type { ReactNode } from "react";

type FeatureTileProps = {
  title: string;
  description?: string;
  icon: ReactNode;
  href?: string;
};

export function FeatureTile({ title, description, icon, href }: FeatureTileProps) {
  const content = (
    <div
      className="feature-tile"
      style={{
        minHeight: 132,
        height: "100%",
        borderRadius: 16,
        border: "1px solid var(--line)",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 18,
        gap: 16
      }}
    >
      <div
        className="feature-tile-icon"
        style={{
          height: 44,
          width: 44,
          borderRadius: 12,
          background: "linear-gradient(135deg, rgba(20, 184, 130, 0.12), rgba(45, 212, 191, 0.12))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--brand-strong)",
          border: "1px solid rgba(10, 127, 81, 0.18)"
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div style={{ display: "grid", gap: 4 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)", letterSpacing: "-0.005em" }}>
          {title}
        </div>
        {description ? (
          <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>
            {description}
          </div>
        ) : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="feature-tile-link"
        aria-label={title}
        style={{ display: "block", height: "100%" }}
      >
        {content}
      </Link>
    );
  }

  return content;
}
