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

type GmailSenderPayload = {
  label: string;
  gmailAddress: string;
  appPassword: string;
  perDayLimit: number;
};

type DomainSenderPayload = {
  label: string;
  domainId: string;
  emailAddress: string;
  username: string;
  password: string;
  perDayLimit: number;
};

type DomainOption = {
  id: string;
  domain: string;
  status: "pending" | "verified" | "failed";
  smtpHost?: string | null;
};

type SenderMode = "gmail" | "domain";

const DEFAULT_GMAIL_FORM: GmailSenderPayload = {
  label: "",
  gmailAddress: "",
  appPassword: "",
  perDayLimit: 2000
};

const DEFAULT_DOMAIN_FORM: DomainSenderPayload = {
  label: "",
  domainId: "",
  emailAddress: "",
  username: "",
  password: "",
  perDayLimit: 2000
};

type AddSenderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => Promise<void>;
};

export function AddSenderDialog({
  open,
  onOpenChange,
  onCreated
}: AddSenderDialogProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<SenderMode>("gmail");
  const [gmailForm, setGmailForm] = useState<GmailSenderPayload>(DEFAULT_GMAIL_FORM);
  const [domainForm, setDomainForm] = useState<DomainSenderPayload>(DEFAULT_DOMAIN_FORM);
  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setMode("gmail");
      setGmailForm(DEFAULT_GMAIL_FORM);
      setDomainForm(DEFAULT_DOMAIN_FORM);
      setDomains([]);
      setFormError("");
      setSubmitting(false);
      setLoadingDomains(false);
    }
  }, [open]);

  const availableDomains = useMemo(
    () => domains.filter((domain) => Boolean(domain.smtpHost)),
    [domains]
  );

  useEffect(() => {
    if (!open) return;
    setLoadingDomains(true);
    browserApi<{ data: DomainOption[] }>("/admin/v1/domains", { cache: "no-store" })
      .then((res) => {
        setDomains(res.data);
      })
      .catch(() => {
        setDomains([]);
      })
      .finally(() => {
        setLoadingDomains(false);
      });
  }, [open]);

  const canSubmit = useMemo(() => {
    if (mode === "gmail") {
      return (
        gmailForm.label.trim().length > 0 &&
        gmailForm.gmailAddress.trim().length > 0 &&
        gmailForm.appPassword.trim().length > 0 &&
        gmailForm.perDayLimit > 0
      );
    }
    return (
      domainForm.label.trim().length > 0 &&
      domainForm.domainId.trim().length > 0 &&
      domainForm.emailAddress.trim().length > 0 &&
      domainForm.username.trim().length > 0 &&
      domainForm.password.trim().length > 0 &&
      domainForm.perDayLimit > 0
    );
  }, [mode, gmailForm, domainForm]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setFormError("");
    setSubmitting(true);
    try {
      if (mode === "gmail") {
        await browserApi("/admin/v1/senders", {
          method: "POST",
          csrf: true,
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({ ...gmailForm, type: "gmail" })
        });
      } else {
        const selectedDomain = domains.find((item) => item.id === domainForm.domainId);
        const emailDomain = domainForm.emailAddress.split("@")[1]?.toLowerCase();
        if (!selectedDomain) {
          setFormError("Select a domain to continue.");
          setSubmitting(false);
          return;
        }
        if (!selectedDomain.smtpHost) {
          setFormError("Selected domain is missing SMTP settings.");
          setSubmitting(false);
          return;
        }
        if (!emailDomain || emailDomain !== selectedDomain.domain.toLowerCase()) {
          setFormError("Email must match the selected domain.");
          setSubmitting(false);
          return;
        }
        await browserApi("/admin/v1/senders", {
          method: "POST",
          csrf: true,
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            type: "domain",
            label: domainForm.label,
            domainId: domainForm.domainId,
            emailAddress: domainForm.emailAddress,
            username: domainForm.username,
            password: domainForm.password,
            perDayLimit: domainForm.perDayLimit
          })
        });
      }
      invalidateBrowserCache("/admin/v1/senders");
      await onCreated();
      toast({
        variant: "success",
        title: "Sender created successfully",
        description: "Sender added successfully."
      });
      onOpenChange(false);
    } catch (err) {
      const { message, isAuth } = parseApiError(err);
      toast({
        variant: "error",
        title: isAuth ? "Session expired" : "Sender creation unsuccessful",
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
          <DialogTitle>Add Sender</DialogTitle>
          <DialogDescription>
            Choose Gmail or a custom domain SMTP sender.
          </DialogDescription>
        </DialogHeader>
        <div className="sender-toggle" role="tablist" aria-label="Sender type">
          <button
            type="button"
            className={mode === "gmail" ? "active" : ""}
            onClick={() => setMode("gmail")}
          >
            Gmail
          </button>
          <button
            type="button"
            className={mode === "domain" ? "active" : ""}
            onClick={() => setMode("domain")}
          >
            Own Domain
          </button>
        </div>
        <form onSubmit={onSubmit} className="grid" style={{ marginTop: 12 }}>
          {mode === "gmail" ? (
            <>
              <label>
                Label
                <input
                  value={gmailForm.label}
                  onChange={(e) =>
                    setGmailForm((prev) => ({ ...prev, label: e.target.value }))
                  }
                  placeholder="Primary Sender"
                  required
                />
              </label>
              <label>
                Gmail Address
                <input
                  type="email"
                  value={gmailForm.gmailAddress}
                  onChange={(e) =>
                    setGmailForm((prev) => ({ ...prev, gmailAddress: e.target.value }))
                  }
                  placeholder="you@gmail.com"
                  required
                />
              </label>
              <label>
                App Password
                <input
                  type="password"
                  value={gmailForm.appPassword}
                  onChange={(e) =>
                    setGmailForm((prev) => ({ ...prev, appPassword: e.target.value }))
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
                  value={gmailForm.perDayLimit}
                  onChange={(e) =>
                    setGmailForm((prev) => ({
                      ...prev,
                      perDayLimit: Number(e.target.value)
                    }))
                  }
                  required
                />
              </label>
            </>
          ) : (
            <>
              <label>
                Label
                <input
                  value={domainForm.label}
                  onChange={(e) =>
                    setDomainForm((prev) => ({ ...prev, label: e.target.value }))
                  }
                  placeholder="Primary Domain Sender"
                  required
                />
              </label>
              <label>
                Domain
                <select
                  value={domainForm.domainId}
                  onChange={(e) =>
                    setDomainForm((prev) => ({ ...prev, domainId: e.target.value }))
                  }
                  required
                  disabled={loadingDomains || domains.length === 0}
                >
                  <option value="">
                  {loadingDomains
                      ? "Loading domains..."
                      : availableDomains.length === 0
                      ? "No domains available"
                      : "Select domain"}
                  </option>
                  {availableDomains.map((domain) => (
                    <option key={domain.id} value={domain.id}>
                      {domain.domain} ({domain.status})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Email Address
                <input
                  type="email"
                  value={domainForm.emailAddress}
                  onChange={(e) =>
                    setDomainForm((prev) => ({ ...prev, emailAddress: e.target.value }))
                  }
                  placeholder="no-reply@company.com"
                  required
                />
              </label>
              <label>
                Username
                <input
                  value={domainForm.username}
                  onChange={(e) =>
                    setDomainForm((prev) => ({ ...prev, username: e.target.value }))
                  }
                  placeholder="smtp username"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={domainForm.password}
                  onChange={(e) =>
                    setDomainForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="SMTP password"
                  required
                />
              </label>
              <label>
                Per-Day Limit
                <input
                  type="number"
                  min={1}
                  value={domainForm.perDayLimit}
                  onChange={(e) =>
                    setDomainForm((prev) => ({
                      ...prev,
                      perDayLimit: Number(e.target.value)
                    }))
                  }
                  required
                />
              </label>
            </>
          )}
          {formError ? <p style={{ color: "#9f1a1a" }}>{formError}</p> : null}
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
