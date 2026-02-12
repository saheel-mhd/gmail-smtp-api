import { AppHeader } from "../../components/app-header";

export default function DocsPage() {
  return (
    <>
      <AppHeader />
      <main className="container">
        <section className="panel docs-hero doc-reveal">
          <div className="badge green docs-pill">Gmail SMTP Platform</div>
          <div className="docs-hero-grid">
            <div>
              <h1>Gmail SMTP API Documentation</h1>
              <p className="muted">
                A complete, operator‑friendly guide to running and integrating the Gmail SMTP
                platform. Learn the architecture, UI modules, API contracts, limits, and
                operational behavior in one place.
              </p>
              <div className="docs-hero-actions">
                <a className="btn small" href="#quick-start">Get Started</a>
                <a className="btn small ghost" href="#public-api">API Reference</a>
              </div>
            </div>
            <div className="docs-hero-card">
              <div className="docs-kpi">
                <div>
                  <div className="docs-kpi-label">Delivery Flow</div>
                  <div className="docs-kpi-value">API → Queue → Worker</div>
                </div>
                <div>
                  <div className="docs-kpi-label">Auth</div>
                  <div className="docs-kpi-value">Session + API Keys</div>
                </div>
                <div>
                  <div className="docs-kpi-label">Limits</div>
                  <div className="docs-kpi-value">Per‑Minute + Per‑Day</div>
                </div>
              </div>
              <div className="docs-hero-note">
                Built for reliable Gmail delivery, with auditability and clear monitoring.
              </div>
            </div>
          </div>
        </section>

        <div className="docs-layout">
          <aside className="panel docs-toc doc-reveal">
            <div className="docs-toc-title">On this page</div>
            <nav className="docs-toc-links">
              <a href="#quick-start">Quick Start</a>
              <a href="#architecture">Architecture</a>
              <a href="#dashboard">Dashboard Modules</a>
              <a href="#security">Auth & Security</a>
              <a href="#public-api">Public API</a>
              <a href="#templates">Templates</a>
              <a href="#rate-limits">Rate Limits</a>
              <a href="#logs">Logs</a>
              <a href="#admin-api">Admin API</a>
              <a href="#env">Environment</a>
              <a href="#troubleshooting">Troubleshooting</a>
            </nav>
          </aside>

          <div className="docs-content">
            <section className="panel docs-section doc-reveal" id="quick-start">
              <div className="docs-section-head">
                <h2>Quick Start</h2>
                <span className="badge">Setup</span>
              </div>
              <p className="muted">
                Run the full stack locally: Web UI, API server, Worker, Postgres, Redis.
              </p>
              <ol className="docs-list">
                <li>Install dependencies: <code>npm install</code></li>
                <li>Configure env: update <code>.env</code> with Postgres and Redis URLs.</li>
                <li>Run migrations: <code>npx prisma migrate dev --schema apps/api/prisma/schema.prisma</code></li>
                <li>Start services (separate terminals):</li>
              </ol>
              <pre className="docs-code">
                <code>{`npm run dev:api
npm run dev:worker
npm run dev:web`}</code>
              </pre>
              <div className="docs-callout">
                <strong>Tip:</strong> <code>npm run dev</code> starts the web app only.
                The API + worker must be running to send email.
              </div>
            </section>

            <section className="panel docs-section doc-reveal" id="architecture">
              <div className="docs-section-head">
                <h2>Architecture</h2>
                <span className="badge">Platform</span>
              </div>
              <div className="docs-grid">
                <div className="docs-card">
                  <div className="docs-card-title">Web UI</div>
                  <div className="muted">Next.js dashboard for senders, keys, templates, logs.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">API Server</div>
                  <div className="muted">Fastify REST API for admin + public sending endpoints.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Worker</div>
                  <div className="muted">BullMQ worker that sends via Gmail SMTP.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Postgres</div>
                  <div className="muted">Data store for senders, keys, templates, messages, logs.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Redis</div>
                  <div className="muted">Queue + rate‑limit counters and daily quotas.</div>
                </div>
              </div>
            </section>

            <section className="panel docs-section doc-reveal" id="dashboard">
              <div className="docs-section-head">
                <h2>Dashboard Modules</h2>
                <span className="badge">UI</span>
              </div>
              <div className="docs-grid">
                <div className="docs-card">
                  <div className="docs-card-title">Senders</div>
                  <div className="muted">Connect Gmail accounts, set daily limits, monitor sent counts.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">API Keys</div>
                  <div className="muted">Create keys, set per‑minute rate limits, and scope senders.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Templates</div>
                  <div className="muted">Build HTML + subject templates with variables.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Test API</div>
                  <div className="muted">Send a test email using a selected sender + API key.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Action Logs</div>
                  <div className="muted">Human‑readable audit trail of admin actions.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Email Logs</div>
                  <div className="muted">Delivery history with status, subject, and sender.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">System Logs</div>
                  <div className="muted">Worker/API lifecycle events and system‑level activity.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Account</div>
                  <div className="muted">User profile, role, tenant details.</div>
                </div>
              </div>
            </section>

            <section className="panel docs-section doc-reveal" id="security">
              <div className="docs-section-head">
                <h2>Authentication & Security</h2>
                <span className="badge">Security</span>
              </div>
              <ul className="docs-list">
                <li>Admin uses session cookies from <code>POST /admin/v1/auth/login</code>.</li>
                <li>Mutating admin requests require CSRF header: <code>x-csrf-token</code>.</li>
                <li>Public API uses Bearer keys: <code>Authorization: Bearer &lt;apiKey&gt;</code>.</li>
                <li>API keys can be restricted to allowed IPs.</li>
                <li>Idempotency is enforced on <code>/v1/send</code> via <code>idempotencyKey</code>.</li>
              </ul>
            </section>

            <section className="panel docs-section doc-reveal" id="public-api">
              <div className="docs-section-head">
                <h2>Public API</h2>
                <span className="badge">Reference</span>
              </div>
              <p className="muted">
                Use these endpoints from your application code. All requests require a Bearer API key.
              </p>
              <div className="docs-grid">
                <div className="docs-card">
                  <div className="docs-card-title">POST /v1/send</div>
                  <div className="muted">Queue an email. Returns 202 with a messageId.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">POST /v1/send/:templateName</div>
                  <div className="muted">Send using a named template (URL-safe template name).</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">GET /v1/senders</div>
                  <div className="muted">List senders allowed by this API key.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">GET /v1/messages/:id</div>
                  <div className="muted">Fetch delivery status for a message.</div>
                </div>
              </div>
              <pre className="docs-code">
                <code>{`POST /v1/send
Authorization: Bearer gsk_xxx
Content-Type: application/json

{
  "idempotencyKey": "order-2026-0001",
  "to": ["user@example.com"],
  "subject": "Welcome!",
  "html": "<h1>Hello</h1>"
}`}</code>
              </pre>
              <pre className="docs-code">
                <code>{`POST /v1/send/welcome-email
Authorization: Bearer gsk_xxx
Content-Type: application/json

{
  "idempotencyKey": "welcome-0001",
  "to": ["user@example.com"],
  "variables": { "firstName": "Stallone", "companyName": "Acme" }
}`}</code>
              </pre>
              <div className="docs-callout">
                <strong>Idempotency:</strong> use a stable <code>idempotencyKey</code> to
                avoid duplicate sends. Sender is derived from the API key (one sender per key).
              </div>
            </section>

            <section className="panel docs-section doc-reveal" id="templates">
              <div className="docs-section-head">
                <h2>Templates</h2>
                <span className="badge">Content</span>
              </div>
              <p className="muted">
                Templates support Mustache‑style variables in both subject and HTML.
              </p>
              <p className="muted">
                Template names must be URL-safe (lowercase letters, numbers, hyphens). The name
                becomes the endpoint slug for <code>/v1/send/:templateName</code>.
              </p>
              <pre className="docs-code">
                <code>{`<h1>Hello {{firstName}},</h1>
<p>Thanks for joining {{companyName}}.</p>`}</code>
              </pre>
              <p className="muted">
                Use templates by calling <code>/v1/send/:templateName</code> with variables.
                Missing variables return a 400. You can also send via <code>/v1/send</code> with a
                <code>templateId</code> if you prefer IDs.
              </p>
              <pre className="docs-code">
                <code>{`POST /v1/send/welcome-email
Authorization: Bearer gsk_xxx
Content-Type: application/json

{
  "idempotencyKey": "welcome-0001",
  "variables": { "firstName": "Stallone", "companyName": "Acme" },
  "to": ["stallonamg@gmail.com"]
}`}</code>
              </pre>
            </section>

            <section className="panel docs-section doc-reveal" id="rate-limits">
              <div className="docs-section-head">
                <h2>Rate Limits & Quotas</h2>
                <span className="badge">Limits</span>
              </div>
              <ul className="docs-list">
                <li>API key rate limit is per‑minute. Exceeding returns 429.</li>
                <li>Sender daily limit controls how many emails can be sent per sender each day.</li>
                <li>Daily limits reset at UTC midnight.</li>
                <li>Max 10 total recipients (to + cc + bcc) per send request.</li>
              </ul>
            </section>

            <section className="panel docs-section doc-reveal" id="logs">
              <div className="docs-section-head">
                <h2>Logs & Monitoring</h2>
                <span className="badge">Observability</span>
              </div>
              <ul className="docs-list">
                <li>Action Logs show admin activity like sender updates and key rotations.</li>
                <li>Email Logs show delivery attempts and outcomes per message.</li>
                <li>System Logs track worker/API lifecycle events and internal health.</li>
              </ul>
            </section>

            <section className="panel docs-section doc-reveal" id="admin-api">
              <div className="docs-section-head">
                <h2>Admin API (Dashboard)</h2>
                <span className="badge">Admin</span>
              </div>
              <p className="muted">
                These endpoints power the dashboard UI and require a session cookie.
              </p>
              <ul className="docs-list">
                <li><code>POST /admin/v1/auth/login</code> - sign in and receive session + CSRF.</li>
                <li><code>POST /admin/v1/auth/logout</code> - end session.</li>
                <li><code>GET /admin/v1/me</code> - current user and tenant.</li>
                <li><code>GET/POST/PATCH/DELETE /admin/v1/senders</code> - sender management.</li>
                <li><code>GET/POST/PATCH/DELETE /admin/v1/templates</code> - template management.</li>
                <li><code>GET/POST/DELETE /admin/v1/api-keys</code> - API key management.</li>
                <li><code>POST /admin/v1/api-keys/:id/rotate</code> - rotate key.</li>
                <li><code>POST /admin/v1/test-api/send</code> - test email sending.</li>
                <li><code>GET /admin/v1/logs</code> - action logs.</li>
                <li><code>GET /admin/v1/email-logs</code> - email delivery logs.</li>
                <li><code>GET /admin/v1/system-logs</code> - system logs.</li>
              </ul>
            </section>

            <section className="panel docs-section doc-reveal" id="env">
              <div className="docs-section-head">
                <h2>Environment Variables</h2>
                <span className="badge">Config</span>
              </div>
              <div className="docs-grid">
                <div className="docs-card"><code>DATABASE_URL</code> - Postgres connection string.</div>
                <div className="docs-card"><code>REDIS_URL</code> - Redis connection for queue + counters.</div>
                <div className="docs-card"><code>API_PORT</code> - API server port.</div>
                <div className="docs-card"><code>WEB_PORT</code> - Web server port.</div>
                <div className="docs-card"><code>JWT_SECRET</code> - session token signing secret.</div>
                <div className="docs-card"><code>DEFAULT_PER_DAY_LIMIT</code> - sender daily limit default.</div>
                <div className="docs-card"><code>DEFAULT_API_KEY_RATE_LIMIT</code> - per‑minute limit default.</div>
                <div className="docs-card"><code>APP_BASE_URL</code> - public web URL.</div>
                <div className="docs-card"><code>API_BASE_URL</code> - public API URL.</div>
              </div>
            </section>

            <section className="panel docs-section doc-reveal" id="troubleshooting">
              <div className="docs-section-head">
                <h2>Troubleshooting</h2>
                <span className="badge">Support</span>
              </div>
              <ul className="docs-list">
                <li>401 Unauthorized: missing session cookie or API key.</li>
                <li>403 Forbidden: CSRF token mismatch or IP not allowed.</li>
                <li>429 Too Many Requests: rate limit or daily quota exceeded.</li>
                <li>503 Queue Unavailable: Redis/worker not running.</li>
                <li>Template errors: missing variables or inactive template.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

