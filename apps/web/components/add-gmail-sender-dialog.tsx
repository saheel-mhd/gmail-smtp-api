"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { browserApi, invalidateBrowserCache } from "../lib/browser-api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "./ui/dialog";
import { useToast } from "./ui/toast";

type CreateSenderPayload = {
  label: string;
  gmailAddress: string;
  appPassword: string;
  perDayLimit: number;
};

const DEFAULT_FORM: CreateSenderPayload = {
  label: "",
  gmailAddress: "",
  appPassword: "",
  perDayLimit: 2000
};

type AddGmailSenderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => Promise<void>;
};

export function AddGmailSenderDialog({
  open,
  onOpenChange,
  onCreated
}: AddGmailSenderDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<CreateSenderPayload>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(DEFAULT_FORM);
      setSubmitting(false);
    }
  }, [open]);

  const canSubmit = useMemo(() => {
    return (
      form.label.trim().length > 0 &&
      form.gmailAddress.trim().length > 0 &&
      form.appPassword.trim().length > 0 &&
      form.perDayLimit > 0
    );
  }, [form]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await browserApi("/admin/v1/senders", {
        method: "POST",
        csrf: true,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(form)
      });
      invalidateBrowserCache("/admin/v1/senders");
      await onCreated();
      toast({
        variant: "success",
        title: "Sender created successfully",
        description: "Gmail sender added successfully."
      });
      onOpenChange(false);
    } catch (err) {
      toast({
        variant: "error",
        title: "Sender creation unsuccessful",
        description: (err as Error).message || "Failed to add sender."
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Gmail Sender</DialogTitle>
          <DialogDescription>
            Connect a Gmail account with an app password. This sender will be used for SMTP delivery.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid" style={{ marginTop: 12 }}>
          <label>
            Label
            <input
              value={form.label}
              onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
              placeholder="Primary Sender"
              required
            />
          </label>
          <label>
            Gmail Address
            <input
              type="email"
              value={form.gmailAddress}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, gmailAddress: e.target.value }))
              }
              placeholder="you@gmail.com"
              required
            />
          </label>
          <label>
            App Password
            <input
              type="password"
              value={form.appPassword}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, appPassword: e.target.value }))
              }
              placeholder="Gmail app password"
              required
            />
          </label>
          <label>
            Per-Day Limit
            <input
              type="number"
              min={1}
              value={form.perDayLimit}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, perDayLimit: Number(e.target.value) }))
              }
              required
            />
          </label>
          <DialogFooter>
            <button
              className="btn small ghost"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button className="btn small" type="submit" disabled={submitting || !canSubmit}>
              {submitting ? "Adding..." : "Add Sender"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
