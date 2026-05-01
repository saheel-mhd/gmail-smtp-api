"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { createPortal } from "react-dom";

type DialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used within <Dialog>.");
  return ctx;
}

export function Dialog({
  open,
  onOpenChange,
  children
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ open, onOpenChange }), [open, onOpenChange]);
  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export function DialogTrigger(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { onOpenChange } = useDialogContext();
  const { onClick, type = "button", ...rest } = props;
  return (
    <button
      type={type}
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onOpenChange(true);
      }}
    />
  );
}

export function DialogClose(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { onOpenChange } = useDialogContext();
  const { onClick, type = "button", ...rest } = props;
  return (
    <button
      type={type}
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onOpenChange(false);
      }}
    />
  );
}

type DialogSize = "default" | "lg" | "xl";

export function DialogContent({
  children,
  size = "default"
}: {
  children: React.ReactNode;
  size?: DialogSize;
}) {
  const { open, onOpenChange } = useDialogContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    },
    [onOpenChange]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open, onEscape]);

  // Lock page scroll while the dialog is open so the page's own scrollbar
  // doesn't show through behind the dialog.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open || !mounted) return null;

  const sizeClass = size === "default" ? "" : ` dialog-content-${size}`;

  return createPortal(
    <div
      className="dialog-overlay"
      role="presentation"
      onClick={() => onOpenChange(false)}
    >
      <div
        className={`dialog-content${sizeClass}`}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="dialog-header">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="dialog-title">{children}</h2>;
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="dialog-description">{children}</p>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="dialog-footer">{children}</div>;
}
