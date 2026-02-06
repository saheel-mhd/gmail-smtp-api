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

type Sender = {
  id: string;
  label: string;
  gmailAddress: string;
};

type CreateApiKeyPayload = {
  name: string;
  smtpAccountIds: string[];
  rateLimitPerMinute: number;
  allowedIps: string[];
};

const DEFAULT_FORM: CreateApiKeyPayload = {
  name: "",
  smtpAccountIds: [],
  rateLimitPerMinute: 120,
  allowedIps: []
};

type AddApiKeyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  senders: Sender[];
  onCreated: () => Promise<void>;
  onNewKey: (key: string) => void;
};

export function AddApiKeyDialog({
  open,
  onOpenChange,
  senders,
  onCreated,
  onNewKey
}: AddApiKeyDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<CreateApiKeyPayload>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(DEFAULT_FORM);
      setSubmitting(false);
    }
  }, [open]);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.rateLimitPerMinute > 0 &&
      form.smtpAccountIds.length > 0
    );
  }, [form]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const response = await browserApi<{ data: { key: string } }>(
        "/admin/v1/api-keys",
        {
          method: "POST",
          csrf: true,
          headers: { "content-type": "application/json" },
          body: JSON.stringify(form)
        }
      );
      onNewKey(response.data.key);
      invalidateBrowserCache("/admin/v1/api-keys");
      await onCreated();
      toast({
        variant: "success",
        title: "API key created successfully",
        description: "Copy the key now — it is shown only once."
      });
      onOpenChange(false);
    } catch (err) {
      toast({
        variant: "error",
        title: "API key creation unsuccessful",
        description: (err as Error).message || "Failed to create API key"
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            Generate a scoped key for your applications. The key value is shown only once.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid" style={{ marginTop: 12 }}>
          <label>
            Key Name
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Production Key"
              required
            />
          </label>
          <label>
            Rate Limit Per Minute
            <input
              type="number"
              min={1}
              value={form.rateLimitPerMinute}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  rateLimitPerMinute: Number(e.target.value)
                }))
              }
              required
            />
          </label>
          <label>
            Allowed Sender Accounts
            <select
              multiple
              value={form.smtpAccountIds}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions).map((o) => o.value);
                setForm((prev) => ({ ...prev, smtpAccountIds: values }));
              }}
              required
              style={{ minHeight: 120 }}
            >
              {senders.map((sender) => (
                <option value={sender.id} key={sender.id}>
                  {sender.label} ({sender.gmailAddress})
                </option>
              ))}
            </select>
          </label>
          <DialogFooter>
            <button
              className="btn small ghost"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button className="btn small" type="submit" disabled={!canSubmit || submitting}>
              {submitting ? "Creating..." : "Create API Key"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
