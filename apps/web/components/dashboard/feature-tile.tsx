import type { ReactNode } from "react";

type FeatureTileProps = {
  title: string;
  description?: string;
  icon: ReactNode;
};

export function FeatureTile({ title, description, icon }: FeatureTileProps) {
  return (
    <div
      className="feature-tile"
      style={{
        aspectRatio: "5 / 3",
        maxWidth: 260,
        borderRadius: 12,
        border: "1px solid var(--line)",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 14,
        gap: 12
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{title}</div>
        {description ? (
          <div className="muted" style={{ fontSize: 12 }}>
            {description}
          </div>
        ) : null}
      </div>
      <div
        className="feature-tile-icon"
        style={{
          height: 46,
          width: 46,
          borderRadius: 12,
          background: "rgba(10, 127, 81, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--brand-strong)"
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
    </div>
  );
}
