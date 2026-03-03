"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastVariant = "success" | "error";

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastItem = ToastInput & { id: string; state: "open" | "closing" };

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissToast = useCallback(
    (id: string, delayMs = 0) => {
      window.setTimeout(() => {
        setToasts((prev) =>
          prev.map((toast) =>
            toast.id === id ? { ...toast, state: "closing" } : toast
          )
        );
        window.setTimeout(() => removeToast(id), 220);
      }, delayMs);
    },
    [removeToast]
  );

  const toast = useCallback(
    (input: ToastInput) => {
      const id = generateId();
      const item: ToastItem = {
        id,
        variant: input.variant ?? "success",
        durationMs: input.durationMs ?? 4000,
        title: input.title,
        description: input.description,
        state: "open"
      };
      setToasts((prev) => {
        const next = [...prev, item];
        return next.length > 3 ? next.slice(next.length - 3) : next;
      });

      dismissToast(id, item.durationMs);
    },
    [dismissToast]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  const visibleToasts = useMemo(() => toasts.slice(-3), [toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-[100] w-[320px] max-w-[calc(100vw-3rem)]"
        role="region"
        aria-live="polite"
      >
        {visibleToasts
          .slice()
          .reverse()
          .map((item, index) => {
          const tone =
            item.variant === "error"
              ? "border-rose-200 bg-rose-50 text-rose-900"
              : "border-emerald-200 bg-emerald-50 text-emerald-900";
          const offset = index === 0 ? 0 : index === 1 ? 30 : 50;
          const zIndex = 30 - index;
          return (
            <div
              key={item.id}
              className={`absolute right-0 min-h-10 w-full rounded-xl border px-3 py-2 text-sm shadow-[0_12px_24px_rgba(12,34,56,0.12)] transition-all ${
                item.state === "closing" ? "toast-exit" : "toast-enter"
              } ${tone}`}
              style={{ bottom: offset, zIndex }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1 overflow-hidden">
                  <div className="font-semibold truncate">{item.title}</div>
                  {item.description ? (
                    <div className="text-xs opacity-80 line-clamp-2">
                      {item.description}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>.");
  return ctx;
}
