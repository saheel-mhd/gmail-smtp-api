"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { usePathname } from "next/navigation";

type DrawerContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  available: boolean;
};

const DrawerContext = createContext<DrawerContextValue>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
  available: false
});

export function useMobileDrawer() {
  return useContext(DrawerContext);
}

export function MobileDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggle = useCallback(() => setOpen((v) => !v), []);

  // Auto-close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll while drawer open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const value = useMemo(
    () => ({ open, setOpen, toggle, available: true }),
    [open, toggle]
  );

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}
