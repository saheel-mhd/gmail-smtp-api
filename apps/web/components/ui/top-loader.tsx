"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function getCurrentKey(pathname: string, searchParams: URLSearchParams | null) {
  const query = searchParams?.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function isLeftClick(event: MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);

  const currentKey = useMemo(
    () => getCurrentKey(pathname, searchParams),
    [pathname, searchParams]
  );

  useEffect(() => {
    function start() {
      setActive(true);
    }

    function handleClick(event: MouseEvent) {
      if (!isLeftClick(event)) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
        const nextKey = `${url.pathname}${url.search}`;
        if (nextKey === currentKey) return;
        start();
      } catch {
        // ignore malformed urls
      }
    }

    function handlePopState() {
      start();
    }

    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("popstate", handlePopState);
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentKey]);

  useEffect(() => {
    setActive(false);
  }, [currentKey]);

  return (
    <div className={`route-loader${active ? " active" : ""}`}>
      <div className="route-loader__bar" />
    </div>
  );
}
