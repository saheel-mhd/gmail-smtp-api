"use client";

import { useEffect } from "react";
import { useToast } from "./ui/toast";

const TOAST_KEY = "login_success_toast";

export function LoginSuccessToast() {
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const shouldShow = sessionStorage.getItem(TOAST_KEY);
      if (!shouldShow) return;
      sessionStorage.removeItem(TOAST_KEY);
      toast({
        variant: "success",
        title: "Welcome"
      });
    } catch {
      // Ignore storage failures.
    }
  }, [toast]);

  return null;
}
