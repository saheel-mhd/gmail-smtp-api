type TocItem = {
  href: string;
  label: string;
};

const TOC_ITEMS: TocItem[] = [
  { href: "#getting-started", label: "Getting Started" },
  { href: "#architecture", label: "How It Works" },
  { href: "#dashboard", label: "Dashboard Setup" },
  { href: "#security", label: "Auth & Security" },
  { href: "#public-api", label: "Public API" },
  { href: "#sending-rules", label: "Sending Rules" },
  { href: "#templates", label: "Templates" },
  { href: "#delivery-status", label: "Delivery Status" },
  { href: "#rate-limits", label: "Rate Limits" },
  { href: "#troubleshooting", label: "Troubleshooting" }
];

export function DocsToc() {
  return (
    <aside className="panel docs-toc doc-reveal">
      <div className="docs-toc-title">On this page</div>
      <nav className="docs-toc-links">
        {TOC_ITEMS.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
