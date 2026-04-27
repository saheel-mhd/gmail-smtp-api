"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { browserApi } from "../../../lib/browser-api";
import { useToast } from "../../../components/ui/toast";
import { parseApiError } from "../../../lib/api-errors";

type CompanyProfile = {
  id?: string;
  name: string;
  service: string;
  phone: string;
  email: string;
  address: string;
  website?: string | null;
  industry?: string | null;
  companySize?: string | null;
  country?: string | null;
  timezone?: string | null;
  logoUrl?: string | null;
  about?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type CompanyForm = {
  name: string;
  service: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  industry: string;
  companySize: string;
  country: string;
  timezone: string;
  logoUrl: string;
  about: string;
};

const blockedDomains = new Set(["gmail.com", "yahoo.com", "yahoo.co.uk", "yahoo.in"]);

function isBlockedEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return blockedDomains.has(domain);
}

const INDUSTRY_OPTIONS = [
  "SaaS / Software",
  "E-commerce",
  "Marketing & Advertising",
  "Education",
  "Finance & Insurance",
  "Healthcare",
  "Real Estate",
  "Logistics",
  "Media & Publishing",
  "Non-profit",
  "Government",
  "Manufacturing",
  "Travel & Hospitality",
  "Other"
];

const SIZE_OPTIONS = ["1–10", "11–50", "51–200", "201–500", "501–1,000", "1,000+"];

const COUNTRY_OPTIONS = [
  "United States", "United Kingdom", "Canada", "Australia", "India", "Germany",
  "France", "Spain", "Italy", "Netherlands", "Sweden", "Brazil", "Mexico",
  "Japan", "Singapore", "United Arab Emirates", "South Africa", "Other"
];

const TIMEZONE_OPTIONS = [
  "Etc/UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Sao_Paulo", "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Madrid",
  "Africa/Johannesburg", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Asia/Tokyo",
  "Australia/Sydney"
];

const EMPTY_FORM: CompanyForm = {
  name: "",
  service: "",
  phone: "",
  email: "",
  address: "",
  website: "",
  industry: "",
  companySize: "",
  country: "",
  timezone: "",
  logoUrl: "",
  about: ""
};

const REQUIRED_KEYS: (keyof CompanyProfile)[] = ["name", "service", "phone", "email", "address"];
const OPTIONAL_KEYS: (keyof CompanyProfile)[] = [
  "website",
  "industry",
  "companySize",
  "country",
  "timezone",
  "logoUrl",
  "about"
];

function Icon({ path, size = 18 }: { path: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function fieldFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function profileToForm(profile: CompanyProfile | null): CompanyForm {
  if (!profile) return EMPTY_FORM;
  return {
    name: profile.name ?? "",
    service: profile.service ?? "",
    phone: profile.phone ?? "",
    email: profile.email ?? "",
    address: profile.address ?? "",
    website: profile.website ?? "",
    industry: profile.industry ?? "",
    companySize: profile.companySize ?? "",
    country: profile.country ?? "",
    timezone: profile.timezone ?? "",
    logoUrl: profile.logoUrl ?? "",
    about: profile.about ?? ""
  };
}

function getInitials(name: string): string {
  if (!name) return "—";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || name[0].toUpperCase();
}

export default function CompanyPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CompanyForm>(EMPTY_FORM);
  const { toast } = useToast();

  const [stats, setStats] = useState({ senders: 0, apiKeys: 0, domains: 0, loading: true });

  async function loadCompany() {
    setLoading(true);
    try {
      const res = await browserApi<{ data: CompanyProfile | null }>("/admin/v1/company", {
        cache: "no-store"
      });
      setCompany(res.data);
    } catch {
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    setStats((s) => ({ ...s, loading: true }));
    const safeCount = async (path: string) => {
      try {
        const res = await browserApi<{ data: unknown[] }>(path, { cacheTtlMs: 60_000 });
        return Array.isArray(res.data) ? res.data.length : 0;
      } catch {
        return 0;
      }
    };
    const [senders, apiKeys, domains] = await Promise.all([
      safeCount("/admin/v1/senders"),
      safeCount("/admin/v1/api-keys"),
      safeCount("/admin/v1/domains")
    ]);
    setStats({ senders, apiKeys, domains, loading: false });
  }

  useEffect(() => {
    void loadCompany();
    void loadStats();
  }, []);

  const completeness = useMemo(() => {
    if (!company) return 0;
    const filledRequired = REQUIRED_KEYS.filter((k) => fieldFilled(company[k])).length;
    const filledOptional = OPTIONAL_KEYS.filter((k) => fieldFilled(company[k])).length;
    const total = REQUIRED_KEYS.length + OPTIONAL_KEYS.length;
    return Math.round(((filledRequired + filledOptional) / total) * 100);
  }, [company]);

  const missingFields = useMemo(() => {
    if (!company) return [...REQUIRED_KEYS, ...OPTIONAL_KEYS] as string[];
    const labels: Record<string, string> = {
      name: "Name",
      service: "Service",
      phone: "Phone",
      email: "Email",
      address: "Address",
      website: "Website",
      industry: "Industry",
      companySize: "Team size",
      country: "Country",
      timezone: "Timezone",
      logoUrl: "Logo URL",
      about: "About"
    };
    return [...REQUIRED_KEYS, ...OPTIONAL_KEYS]
      .filter((k) => !fieldFilled(company[k]))
      .map((k) => labels[k as string] ?? String(k));
  }, [company]);

  function openCreate() {
    setIsEditing(false);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  }

  function openEdit() {
    setIsEditing(true);
    setForm(profileToForm(company));
    setError("");
    setShowForm(true);
  }

  function handleChange<K extends keyof CompanyForm>(key: K, value: CompanyForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function closeForm() {
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const requiredFilled = REQUIRED_KEYS.every((k) => {
      const value = form[k as keyof CompanyForm];
      return typeof value === "string" && value.trim().length > 0;
    });
    if (!requiredFilled) {
      setError("Please fill in all required fields.");
      return;
    }
    if (isBlockedEmail(form.email)) {
      setError("Please use a company email — public domains are blocked.");
      return;
    }

    setSaving(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
      );
      // strip empty optional strings so server stores null
      OPTIONAL_KEYS.forEach((k) => {
        if (typeof payload[k as string] === "string" && payload[k as string] === "") {
          delete payload[k as string];
        }
      });

      const res = await browserApi<{ data: CompanyProfile }>("/admin/v1/company", {
        method: "POST",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      setCompany(res.data);
      setShowForm(false);
      toast({
        variant: "success",
        title: isEditing ? "Company profile updated" : "Company profile created"
      });
    } catch (err) {
      const { message, isAuth } = parseApiError(err);
      if (!isAuth) {
        setError(message || "Failed to save company.");
      }
      toast({
        variant: "error",
        title: isAuth ? "Session expired" : "Could not save company",
        description: message
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container">
      <section className="panel hero-panel" style={{ padding: 28, marginBottom: 18 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 12px",
            borderRadius: 999,
            background: "rgba(20, 184, 130, 0.10)",
            border: "1px solid rgba(10, 127, 81, 0.25)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--brand-strong)",
            letterSpacing: "0.04em",
            textTransform: "uppercase"
          }}
        >
          Company &amp; Branding
        </div>
        <h1 style={{ margin: "12px 0 6px" }}>Your company profile</h1>
        <p className="muted" style={{ maxWidth: 640, fontSize: 14 }}>
          Used for invoices, support context, deliverability metadata, and public-facing email
          templates. Required to unlock domain features.
        </p>
      </section>

      {loading ? (
        <div className="panel">
          <div className="skeleton" style={{ height: 18, width: 200, marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 14, width: "70%", marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 14, width: "55%" }} />
        </div>
      ) : !company ? (
        <section className="panel" style={{ textAlign: "center", padding: 32 }}>
          <div
            aria-hidden="true"
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 14px",
              borderRadius: 18,
              background: "var(--grad-brand-soft)",
              color: "var(--brand-strong)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon path="M3 21h18 M5 21V7l7-4 7 4v14 M9 9h.01 M12 9h.01 M15 9h.01 M9 13h.01 M12 13h.01 M15 13h.01 M9 17h.01 M12 17h.01 M15 17h.01" size={28} />
          </div>
          <h2 style={{ marginTop: 0 }}>No company profile yet</h2>
          <p className="muted" style={{ maxWidth: 480, margin: "8px auto 0" }}>
            Add basic identity, contact, and address info. We'll use it across invoices, audit logs,
            and outbound templates.
          </p>
          <button className="btn" type="button" onClick={openCreate} style={{ marginTop: 18 }}>
            <Icon path="M12 5v14 M5 12h14" size={14} />
            Add company profile
          </button>
        </section>
      ) : (
        <div style={{ display: "grid", gap: 18 }}>
          {/* Identity hero */}
          <section className="panel" style={{ padding: 22 }}>
            <div
              style={{
                display: "flex",
                gap: 18,
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              {company.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  width={68}
                  height={68}
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 16,
                    objectFit: "cover",
                    border: "1px solid var(--line)",
                    background: "#fff",
                    flexShrink: 0
                  }}
                />
              ) : (
                <div
                  aria-hidden="true"
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 16,
                    background: "var(--grad-brand)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 24,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 18px rgba(20, 184, 130, 0.32)",
                    flexShrink: 0
                  }}
                >
                  {getInitials(company.name)}
                </div>
              )}

              <div style={{ flex: "1 1 280px", minWidth: 0 }}>
                <h2 style={{ margin: 0 }}>{company.name}</h2>
                <div className="muted" style={{ marginTop: 4, fontSize: 14 }}>
                  {company.service}
                  {company.industry ? ` · ${company.industry}` : ""}
                  {company.companySize ? ` · ${company.companySize} people` : ""}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    fontSize: 12
                  }}
                >
                  {company.country ? <span className="badge">{company.country}</span> : null}
                  {company.timezone ? <span className="badge">{company.timezone}</span> : null}
                  {company.website ? (
                    <a
                      href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="badge"
                      style={{ color: "var(--brand-strong)" }}
                    >
                      <Icon path="M10 14a5 5 0 0 0 7.07 0l3.54-3.54a5 5 0 1 0-7.07-7.07l-1 1 M14 10a5 5 0 0 0-7.07 0l-3.54 3.54a5 5 0 1 0 7.07 7.07l1-1" size={12} />
                      {company.website}
                    </a>
                  ) : null}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                <button className="btn ghost" type="button" onClick={openEdit}>
                  <Icon path="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={14} />
                  Edit profile
                </button>
              </div>
            </div>

            {/* Completeness */}
            <div
              style={{
                marginTop: 20,
                padding: 14,
                borderRadius: 14,
                background: "rgba(247, 249, 252, 0.7)",
                border: "1px solid var(--line-soft)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                  flexWrap: "wrap",
                  gap: 8
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Profile completeness</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {missingFields.length === 0
                      ? "Everything filled in — looking great."
                      : `Add: ${missingFields.slice(0, 4).join(", ")}${
                          missingFields.length > 4 ? `, +${missingFields.length - 4} more` : ""
                        }`}
                  </div>
                </div>
                <span
                  className="badge"
                  style={{
                    background:
                      completeness >= 90
                        ? "linear-gradient(135deg, rgba(20, 184, 130, 0.16), rgba(45, 212, 191, 0.16))"
                        : completeness >= 50
                          ? "linear-gradient(135deg, rgba(250, 204, 21, 0.18), rgba(217, 119, 6, 0.14))"
                          : "linear-gradient(135deg, rgba(239, 68, 68, 0.16), rgba(179, 38, 30, 0.14))",
                    color:
                      completeness >= 90
                        ? "var(--brand-strong)"
                        : completeness >= 50
                          ? "#92400e"
                          : "var(--danger)",
                    fontWeight: 600
                  }}
                >
                  {completeness}%
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: "var(--line-soft)",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    width: `${completeness}%`,
                    height: "100%",
                    background:
                      completeness >= 90
                        ? "var(--grad-brand)"
                        : completeness >= 50
                          ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                          : "linear-gradient(135deg, #ef4444, #b3261e)",
                    transition: "width 0.32s ease, background 0.2s ease"
                  }}
                />
              </div>
            </div>
          </section>

          {/* Stats */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12
            }}
          >
            <StatCard
              label="Senders"
              value={stats.loading ? "—" : String(stats.senders)}
              href="/dashboard/senders"
              iconPath="M22 6 12 13 2 6 M2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6 M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2"
            />
            <StatCard
              label="API Keys"
              value={stats.loading ? "—" : String(stats.apiKeys)}
              href="/dashboard/api-keys"
              iconPath="M21 2l-2 2 M11.39 11.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.77-7.77zm0 0L15.5 7.5 M15.5 7.5l3 3L22 7l-3-3"
            />
            <StatCard
              label="Domains"
              value={stats.loading ? "—" : String(stats.domains)}
              href="/dashboard/domains"
              iconPath="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z M3 12h18 M12 3a14 14 0 0 1 0 18"
            />
            <StatCard
              label="Profile updated"
              value={company.updatedAt ? new Date(company.updatedAt).toLocaleDateString() : "—"}
              iconPath="M12 8v4l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
            />
          </section>

          {/* Sections grid */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16
            }}
          >
            <DetailSection
              title="Contact"
              icon="M22 6 12 13 2 6 M2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6 M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2"
              rows={[
                { label: "Email", value: company.email, copyable: true, href: `mailto:${company.email}` },
                { label: "Phone", value: company.phone, copyable: true, href: `tel:${company.phone.replace(/\s+/g, "")}` },
                {
                  label: "Website",
                  value: company.website || "—",
                  href: company.website
                    ? company.website.startsWith("http")
                      ? company.website
                      : `https://${company.website}`
                    : undefined,
                  external: true
                }
              ]}
              onEdit={openEdit}
            />
            <DetailSection
              title="Identity"
              icon="M3 21h18 M5 21V7l7-4 7 4v14"
              rows={[
                { label: "Service / tagline", value: company.service },
                { label: "Industry", value: company.industry || "—" },
                { label: "Team size", value: company.companySize || "—" }
              ]}
              onEdit={openEdit}
            />
            <DetailSection
              title="Location"
              icon="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
              rows={[
                { label: "Address", value: company.address },
                { label: "Country", value: company.country || "—" },
                { label: "Timezone", value: company.timezone || "—" }
              ]}
              onEdit={openEdit}
            />
            <DetailSection
              title="Branding"
              icon="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
              rows={[
                {
                  label: "Logo URL",
                  value: company.logoUrl || "—",
                  href: company.logoUrl ?? undefined,
                  external: true
                },
                {
                  label: "About",
                  value: company.about ?? "—",
                  block: true
                }
              ]}
              onEdit={openEdit}
            />
          </section>

          {/* Related links */}
          <section className="panel">
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap"
              }}
            >
              <div>
                <h2 style={{ margin: 0 }}>Related settings</h2>
                <p className="muted" style={{ marginTop: 4, fontSize: 14 }}>
                  Other tenant-level pages that build on this profile.
                </p>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 10,
                marginTop: 14
              }}
            >
              <Link href="/dashboard/members" className="docs-card" style={{ display: "block" }}>
                <strong>Members</strong>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  Invite teammates, scope roles.
                </div>
              </Link>
              <Link href="/dashboard/domains" className="docs-card" style={{ display: "block" }}>
                <strong>Domains</strong>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  Verify SPF, DKIM, DMARC for sending.
                </div>
              </Link>
              <Link href="/dashboard/account" className="docs-card" style={{ display: "block" }}>
                <strong>Account &amp; security</strong>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  Password, MFA, sessions.
                </div>
              </Link>
              <Link href="/dashboard/logs/actions" className="docs-card" style={{ display: "block" }}>
                <strong>Audit log</strong>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  Track every change to this profile.
                </div>
              </Link>
            </div>

            {company.createdAt ? (
              <div
                className="muted"
                style={{
                  marginTop: 14,
                  fontSize: 12,
                  paddingTop: 14,
                  borderTop: "1px solid var(--line-soft)"
                }}
              >
                Created {formatDate(company.createdAt)} · Updated {formatDate(company.updatedAt)}
              </div>
            ) : null}
          </section>
        </div>
      )}

      {showForm ? (
        <div
          className="dialog-overlay"
          role="presentation"
          onClick={() => closeForm()}
        >
          <div
            className="dialog-content"
            role="dialog"
            aria-modal="true"
            style={{ width: "min(720px, 100%)", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="dialog-header">
              <h2 className="dialog-title">
                {isEditing ? "Edit company profile" : "Add company profile"}
              </h2>
              <p className="dialog-description">
                Required fields are marked with *. Optional fields help us tailor templates and
                deliverability defaults.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid" style={{ marginTop: 14, gap: 14 }}>
              <FieldGroup title="Identity">
                <Row>
                  <Field label="Company name *" required>
                    <input
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      placeholder="Acme Inc."
                    />
                  </Field>
                  <Field label="Service / tagline *" required>
                    <input
                      value={form.service}
                      onChange={(e) => handleChange("service", e.target.value)}
                      required
                      placeholder="Transactional email infrastructure"
                    />
                  </Field>
                </Row>
                <Row>
                  <Field label="Industry">
                    <select
                      value={form.industry}
                      onChange={(e) => handleChange("industry", e.target.value)}
                    >
                      <option value="">Select…</option>
                      {INDUSTRY_OPTIONS.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Team size">
                    <select
                      value={form.companySize}
                      onChange={(e) => handleChange("companySize", e.target.value)}
                    >
                      <option value="">Select…</option>
                      {SIZE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                </Row>
              </FieldGroup>

              <FieldGroup title="Contact">
                <Row>
                  <Field label="Company email *" required>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      placeholder="hello@company.com"
                    />
                  </Field>
                  <Field label="Phone *" required>
                    <input
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                      placeholder="+1 555 555 0101"
                    />
                  </Field>
                </Row>
                <Field label="Website">
                  <input
                    value={form.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    placeholder="https://company.com"
                  />
                </Field>
              </FieldGroup>

              <FieldGroup title="Location">
                <Field label="Address *" required>
                  <input
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    required
                    placeholder="Street, city, ZIP"
                  />
                </Field>
                <Row>
                  <Field label="Country">
                    <select
                      value={form.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                    >
                      <option value="">Select…</option>
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Timezone" hint="Used for sending hours and warmup math">
                    <select
                      value={form.timezone}
                      onChange={(e) => handleChange("timezone", e.target.value)}
                    >
                      <option value="">Select…</option>
                      {TIMEZONE_OPTIONS.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </Field>
                </Row>
              </FieldGroup>

              <FieldGroup title="Branding">
                <Field label="Logo URL" hint="Public HTTPS image URL — shown in headers and emails.">
                  <input
                    value={form.logoUrl}
                    onChange={(e) => handleChange("logoUrl", e.target.value)}
                    placeholder="https://cdn.company.com/logo.png"
                  />
                </Field>
                <Field
                  label="About"
                  hint="Short description used in template footers and audit context."
                >
                  <textarea
                    rows={4}
                    value={form.about}
                    onChange={(e) => handleChange("about", e.target.value)}
                    placeholder="What does your company do?"
                    style={{ resize: "vertical" }}
                  />
                </Field>
              </FieldGroup>

              {error ? (
                <p
                  role="alert"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(179, 38, 30, 0.25)",
                    color: "var(--danger)",
                    fontSize: 13,
                    margin: 0
                  }}
                >
                  {error}
                </p>
              ) : null}

              <div className="dialog-footer">
                <button className="btn ghost" type="button" onClick={closeForm} disabled={saving}>
                  Cancel
                </button>
                <button className="btn" type="submit" disabled={saving}>
                  {saving ? "Saving…" : isEditing ? "Save changes" : "Create profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function StatCard({
  label,
  value,
  iconPath,
  href
}: {
  label: string;
  value: string;
  iconPath: string;
  href?: string;
}) {
  const inner = (
    <div className="stat-card">
      <div className="stat-card-icon">
        <Icon path={iconPath} />
      </div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
    </div>
  );
  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
        {inner}
      </Link>
    );
  }
  return inner;
}

function DetailSection({
  title,
  icon,
  rows,
  onEdit
}: {
  title: string;
  icon: string;
  rows: {
    label: string;
    value: string;
    href?: string;
    external?: boolean;
    copyable?: boolean;
    block?: boolean;
  }[];
  onEdit: () => void;
}) {
  const { toast } = useToast();
  return (
    <section className="panel">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 8
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span
            aria-hidden="true"
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: "var(--grad-brand-soft)",
              color: "var(--brand-strong)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(10, 127, 81, 0.18)"
            }}
          >
            <Icon path={icon} size={14} />
          </span>
          <h3 style={{ margin: 0, fontSize: 15 }}>{title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="btn ghost small"
          style={{ padding: "4px 10px" }}
        >
          Edit
        </button>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {rows.map((row) => (
          <div
            key={row.label}
            style={{
              display: row.block ? "block" : "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(247, 249, 252, 0.7)",
              border: "1px solid var(--line-soft)",
              fontSize: 13
            }}
          >
            <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: row.block ? 4 : 0 }}>
              {row.label}
            </div>
            <div
              style={{
                fontWeight: 500,
                color: "var(--ink)",
                textAlign: row.block ? "left" : "right",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                maxWidth: row.block ? "100%" : "65%",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
                justifyContent: row.block ? "flex-start" : "flex-end"
              }}
            >
              {row.href && row.value !== "—" ? (
                <a
                  href={row.href}
                  target={row.external ? "_blank" : undefined}
                  rel={row.external ? "noreferrer" : undefined}
                  style={{ color: "var(--brand-strong)" }}
                >
                  {row.value} {row.external ? "↗" : ""}
                </a>
              ) : (
                <span>{row.value}</span>
              )}
              {row.copyable && row.value !== "—" ? (
                <button
                  type="button"
                  aria-label={`Copy ${row.label}`}
                  onClick={() => {
                    navigator.clipboard
                      .writeText(row.value)
                      .then(() => toast({ variant: "success", title: `${row.label} copied` }))
                      .catch(() => toast({ variant: "error", title: "Copy failed" }));
                  }}
                  style={{
                    border: 0,
                    background: "transparent",
                    cursor: "pointer",
                    color: "var(--muted)",
                    padding: 2,
                    borderRadius: 4
                  }}
                >
                  <Icon path="M9 9h10v10H9z M5 5h10v10H5z" size={12} />
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset
      style={{
        border: "1px solid var(--line-soft)",
        borderRadius: 14,
        padding: 14,
        margin: 0,
        display: "grid",
        gap: 10
      }}
    >
      <legend
        style={{
          padding: "0 8px",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--muted-strong)",
          textTransform: "uppercase",
          letterSpacing: "0.06em"
        }}
      >
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 10
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label>
      {label}
      {children}
      {hint ? (
        <span className="muted" style={{ fontSize: 11, marginTop: 2 }}>
          {hint}
        </span>
      ) : null}
    </label>
  );
}
