"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { browserApi } from "../../../lib/browser-api";
import { useToast } from "../../../components/ui/toast";
import { parseApiError } from "../../../lib/api-errors";

type CompanyProfile = {
  name: string;
  service: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
};

const blockedDomains = new Set([
  "gmail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.in"
]);

function isBlockedEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return blockedDomains.has(domain);
}

export default function CompanyPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<CompanyProfile>({
    name: "",
    service: "",
    phone: "",
    email: "",
    address: "",
    website: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    browserApi<{ data: CompanyProfile | null }>("/admin/v1/company")
      .then((res) => {
        if (isMounted) setCompany(res.data);
      })
      .catch(() => {
        if (isMounted) setCompany(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.service.trim().length > 0 &&
      form.phone.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.address.trim().length > 0
    );
  }, [form]);

  function handleChange<K extends keyof CompanyProfile>(key: K, value: CompanyProfile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleCancel() {
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!canSubmit) {
      setError("Please fill in all required fields.");
      return;
    }
    if (isBlockedEmail(form.email)) {
      setError("Company email only.");
      return;
    }

    try {
      const payload: CompanyProfile = {
        ...form,
        website: form.website?.trim() ? form.website.trim() : undefined
      };
      const res = await browserApi<{ data: CompanyProfile }>("/admin/v1/company", {
        method: "POST",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      setCompany(res.data);
      setShowForm(false);
    } catch (err) {
      const { message, isAuth } = parseApiError(err);
      if (!isAuth) {
        setError(message || "Failed to save company.");
      } else {
        setError("");
      }
      toast({
        variant: "error",
        title: isAuth ? "Session expired" : "Company save unsuccessful",
        description: message
      });
    }
  }

  return (
    <main className="container">
      <section className="panel" style={{ textAlign: "center" }}>
        <h1>Company</h1>
        <p className="muted">
          You have not added a company yet. Add one to unlock features.
        </p>
        {loading ? (
          <p className="muted" style={{ marginTop: 16 }}>
            Loading company profile...
          </p>
        ) : !company ? (
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
            <button className="btn" type="button" onClick={() => setShowForm(true)}>
              Add Company
            </button>
          </div>
        ) : (
          <div style={{ marginTop: 16 }}>
            <p style={{ color: "#0a7f51", fontWeight: 600 }}>
              Company profile added. Features unlocked.
            </p>
          </div>
        )}
      </section>

      {company ? (
        <section className="panel" style={{ marginTop: 16 }}>
          <h2>Company Profile</h2>
          <div className="grid">
            <div>
              <strong>Name:</strong> {company.name}
            </div>
            <div>
              <strong>Service:</strong> {company.service}
            </div>
            <div>
              <strong>Phone:</strong> {company.phone}
            </div>
            <div>
              <strong>Email:</strong> {company.email}
            </div>
            <div>
              <strong>Address:</strong> {company.address}
            </div>
            {company.website ? (
              <div>
                <strong>Website:</strong> {company.website}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {showForm ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 18, 25, 0.4)",
            display: "grid",
            placeItems: "center",
            zIndex: 40
          }}
        >
          <div className="panel" style={{ width: "100%", maxWidth: 600 }}>
            <h2>Add Company</h2>
            <form onSubmit={handleSubmit} className="grid" style={{ marginTop: 12 }}>
              <label>
                Company Name
                <input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </label>
              <label>
                Service
                <input
                  value={form.service}
                  onChange={(e) => handleChange("service", e.target.value)}
                  required
                />
              </label>
              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </label>
              <label>
                Company Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </label>
              <label>
                Address
                <input
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  required
                />
              </label>
              <label>
                Website (optional)
                <input
                  value={form.website ?? ""}
                  onChange={(e) => handleChange("website", e.target.value)}
                />
              </label>
              {error ? <p style={{ color: "#9f1a1a" }}>{error}</p> : null}
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn" type="submit">
                  Save Company
                </button>
                <button className="btn secondary" type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
