"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

function getCurrentKey(pathname: string, searchParams: URLSearchParams | null) {
  const query = searchParams?.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = useMemo(() => getCurrentKey(pathname, searchParams), [pathname, searchParams]);

  return (
    <div key={key} className="page-transition">
      {children}
    </div>
  );
}
