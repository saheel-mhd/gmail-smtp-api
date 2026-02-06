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

export function DialogContent({
  children
}: {
  children: React.ReactNode;
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

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="dialog-overlay"
      role="presentation"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="dialog-content"
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
