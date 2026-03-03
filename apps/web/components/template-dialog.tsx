"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { browserApi, invalidateBrowserCache } from "../lib/browser-api";
import { parseApiError } from "../lib/api-errors";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "./ui/dialog";
import { useToast } from "./ui/toast";

type TemplatePayload = {
  name: string;
  subject: string;
  html: string;
  text: string;
};

type TemplateRecord = {
  id: string;
  name: string;
  subject: string;
  html: string;
  text: string | null;
};

const DEFAULT_FORM: TemplatePayload = {
  name: "",
  subject: "",
  html: "",
  text: ""
};

type TemplateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => Promise<void>;
  initial?: TemplateRecord | null;
};

export function TemplateDialog({
  open,
  onOpenChange,
  onSaved,
  initial
}: TemplateDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState<TemplatePayload>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(DEFAULT_FORM);
      setSubmitting(false);
      return;
    }
    if (initial) {
      setForm({
        name: initial.name,
        subject: initial.subject,
        html: initial.html,
        text: initial.text ?? ""
      });
    }
  }, [open, initial]);

  const canSubmit = useMemo(() => {
    return form.name.trim() && form.subject.trim() && form.html.trim();
  }, [form]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const trimmedName = form.name.trim();
      const trimmedSubject = form.subject.trim();
      const payload: { name?: string; subject: string; html: string; text?: string | null } = {
        subject: trimmedSubject,
        html: form.html,
        text: form.text.trim() ? form.text : null
      };
      if (initial?.id) {
        const sameName =
          trimmedName.toLowerCase() === initial.name.trim().toLowerCase();
        if (!sameName) {
          payload.name = trimmedName;
        }
      } else {
        payload.name = trimmedName;
      }

      if (initial?.id) {
        await browserApi(`/admin/v1/templates/${initial.id}`, {
          method: "PATCH",
          csrf: true,
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        invalidateBrowserCache("/admin/v1/templates");
        toast({
          variant: "success",
          title: "Template updated successfully"
        });
      } else {
        await browserApi("/admin/v1/templates", {
          method: "POST",
          csrf: true,
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        invalidateBrowserCache("/admin/v1/templates");
        toast({
          variant: "success",
          title: "Template created successfully"
        });
      }

      await onSaved();
      onOpenChange(false);
    } catch (err) {
      const { message, isAuth } = parseApiError(err);
      toast({
        variant: "error",
        title: isAuth
          ? "Session expired"
          : initial?.id
          ? "Template update unsuccessful"
          : "Template creation unsuccessful",
        description: message
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Template" : "Create Template"}</DialogTitle>
          <DialogDescription>
            Use Mustache-style variables like {"{{firstName}}"} in the subject and HTML.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid" style={{ marginTop: 12 }}>
          <label>
            Template Name
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="welcome-email"
              required
            />
            <small className="muted">URL-safe only: lowercase letters, numbers, hyphens.</small>
          </label>
          <label>
            Subject
            <input
              value={form.subject}
              onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="Welcome, {{firstName}}"
              required
            />
          </label>
          <label>
            HTML
            <textarea
              rows={8}
              value={form.html}
              onChange={(e) => setForm((prev) => ({ ...prev, html: e.target.value }))}
              placeholder="<h1>Hello {{firstName}}</h1>"
              required
            />
          </label>
          <label>
            Text (optional)
            <textarea
              rows={4}
              value={form.text}
              onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
              placeholder="Hello {{firstName}}"
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
            <button className="btn small" type="submit" disabled={!canSubmit || submitting}>
              {submitting ? "Saving..." : initial ? "Save Template" : "Create Template"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
