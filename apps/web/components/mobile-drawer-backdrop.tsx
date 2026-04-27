"use client";

import { useMobileDrawer } from "./mobile-drawer";

export function MobileDrawerBackdrop() {
  const { open, setOpen } = useMobileDrawer();
  return (
    <div
      className={`mobile-drawer-backdrop${open ? " open" : ""}`}
      aria-hidden={!open}
      onClick={() => setOpen(false)}
    />
  );
}
