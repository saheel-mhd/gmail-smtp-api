import { AppHeader } from "../../components/app-header";
import { DocsToc } from "../../components/docs-toc";

export default function DocsPage() {
  return (
    <>
      <AppHeader />
      <main className="container">
        <section className="panel docs-hero doc-reveal" id="docs-hero">
          <div className="badge green docs-pill">Mailler SMTP Platform</div>
          <div className="docs-hero-grid">
            <div>
              <h1>Mailler SMTP API Documentation</h1>
              <p className="muted">
                A client-friendly guide to integrating Mailler. Send from Gmail accounts or
                verified custom domains with a queue-first pipeline, strong security, and clear
                delivery status.
              </p>
              <div className="docs-hero-actions">
                <a className="btn small" href="#getting-started">Get Started</a>
                <a className="btn small ghost" href="#public-api">API Reference</a>
              </div>
            </div>
            <div className="docs-hero-card">
              <div className="docs-kpi">
                <div>
                  <div className="docs-kpi-label">Delivery Flow</div>
                  <div className="docs-kpi-value">API {"->"} Queue {"->"} Worker</div>
                </div>
                <div>
                  <div className="docs-kpi-label">Auth</div>
                  <div className="docs-kpi-value">Session + API Keys</div>
                </div>
                <div>
                  <div className="docs-kpi-label">Senders</div>
                  <div className="docs-kpi-value">Gmail + Custom Domains</div>
                </div>
              </div>
              <div className="docs-hero-note">
                Built for fast API responses, strong audit trails, and dependable sending.
              </div>
            </div>
          </div>
        </section>

        <div className="docs-layout">
          <DocsToc />

          <div className="docs-content">
            <section className="panel docs-section doc-reveal" id="getting-started">
              <div className="docs-section-head">
                <h2>Getting Started</h2>
                <span className="badge">Onboarding</span>
              </div>
              <p className="muted">
                Follow these steps in the dashboard to start sending.
              </p>
              <ol className="docs-list">
                <li>Create your account and sign in.</li>
                <li>Add Company details to unlock domain features.</li>
                <li>Verify your domain DNS (TXT/SPF/CNAME/MX) or use Gmail senders.</li>
                <li>Add a Sender (Gmail or custom domain SMTP).</li>
                <li>Create a Template with URL-safe name (e.g. <code>welcome-email</code>).</li>
                <li>Create an API key scoped to one sender.</li>
                <li>Send your first email using the API.</li>
              </ol>
              <div className="docs-callout">
                <strong>Tip:</strong> Use the Test API page to send a sample email before integrating
                your app.
              </div>
            </section>

            <section className="panel docs-section doc-reveal" id="architecture">
              <div className="docs-section-head">
                <h2>How It Works</h2>
                <span className="badge">Platform</span>
              </div>
              <div className="docs-grid">
                <div className="docs-card">
                  <div className="docs-card-title">Web UI</div>
                  <div className="muted">Next.js dashboard for domains, senders, keys, templates, logs.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">API Server</div>
                  <div className="muted">Fastify REST API for admin + public sending endpoints.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Worker</div>
                  <div className="muted">BullMQ worker that sends via SMTP with retries.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Postgres</div>
                  <div className="muted">Data store for tenants, senders, templates, messages, logs.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Redis</div>
                  <div className="muted">Queue + rate-limit counters and daily quotas.</div>
                </div>
              </div>
            </section>

            <section className="panel docs-section doc-reveal" id="dashboard">
              <div className="docs-section-head">
                <h2>Dashboard Setup</h2>
                <span className="badge">UI</span>
              </div>
              <div className="docs-grid">
                <div className="docs-card">
                  <div className="docs-card-title">Company</div>
                  <div className="muted">Store organization details and unlock domain features.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Domains</div>
                  <div className="muted">Verify DNS (TXT/SPF/CNAME/MX) and manage SMTP settings.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Senders</div>
                  <div className="muted">Add Gmail senders or custom-domain senders with limits.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">API Keys</div>
                  <div className="muted">Create keys, set per-minute limits, and scope to one sender.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Templates</div>
                  <div className="muted">Build URL-safe templates with variables.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Test API</div>
                  <div className="muted">Send a test email using a selected API key and sender.</div>
                </div>
                <div className="docs-card">
                  <div className="docs-card-title">Delivery Logs</div>
                  <div className="muted">Queued/sent/failed messages with error details.</div>
                </div>
              </div>
            </section>

            <section className="panel docs-section doc-reveal" id="security">
              <div className="docs-section-head">
                <h2>Authentication & Security</h2>
                <span className="badge">Security</span>
              </div>
              <ul className="docs-list">
                <li>The dashboard uses session cookies after you sign in.</li>
                <li>Browser-based dashboard requests include CSRF protection.</li>
                <li>Public API uses Bearer keys: <code>Authorization: Bearer &lt;apiKey&gt;</code>.</li>
                <li>API keys are scoped to exactly one sender.</li>
                <li>API keys can be restricted to allowed IPs.</li>
                <li>Invalid or revoked keys are rejected and recorded for audit.</li>
                <li>App passwords and SMTP secrets are encrypted at rest.</li>
                <li>Keep API keys server-side. Do not embed them in browser or mobile apps.</li>
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
              <ul className="docs-list">
                <li>Base URL matches the API host you received in onboarding.</li>
                <li>All requests are JSON with <code>Content-Type: application/json</code>.</li>
                <li>Successful send requests return <code>202</code> with a <code>messageId</code>.</li>
                <li>Idempotent replay returns <code>200</code> with <code>idempotentReplay: true</code>.</li>
              </ul>
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
                <strong>Idempotency:</strong> use a stable <code>idempotencyKey</code> to avoid
                duplicate sends. Sender is derived from the API key (one sender per key).
              </div>
            </section>

            <section className="panel docs-section doc-reveal" id="sending-rules">
              <div className="docs-section-head">
                <h2>Sending Rules</h2>
                <span className="badge">Payload</span>
              </div>
              <ul className="docs-list">
                <li><code>idempotencyKey</code> is required (8-120 chars). Reusing it returns the original message.</li>
                <li><code>to</code> is required. Total recipients (to + cc + bcc) must be 10 or fewer.</li>
                <li>Without templates, <code>subject</code> and one of <code>text</code>/<code>html</code> are required.</li>
                <li>When using <code>templateId</code>, omit <code>subject</code>, <code>text</code>, and <code>html</code>.</li>
                <li><code>fromName</code> is optional. The From address is the sender tied to your API key.</li>
                <li><code>replyTo</code> is optional and must be a valid email.</li>
                <li>Custom headers are allowed but cannot include To/From/CC/BCC/Subject/Content-Type/MIME-Version.</li>
              </ul>
            </section>

            <section className="panel docs-section doc-reveal" id="templates">
              <div className="docs-section-head">
                <h2>Templates</h2>
                <span className="badge">Content</span>
              </div>
              <p className="muted">
                Templates support Mustache-style variables in both subject and HTML.
              </p>
              <p className="muted">
                Variables can be strings, numbers, or booleans.
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
                Use templates by calling <code>/v1/send/:templateName</code> with variables. Missing
                variables return a 400. You can also send via <code>/v1/send</code> with a
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
                <li>API key rate limit is per-minute. Exceeding returns 429.</li>
                <li>Tenant daily quota is enforced to prevent spikes.</li>
                <li>Sender daily limit controls how many emails can be sent per sender each day.</li>
                <li>Daily limits reset at UTC midnight.</li>
                <li>Max 10 total recipients (to + cc + bcc) per send request.</li>
              </ul>
            </section>

            <section className="panel docs-section doc-reveal" id="delivery-status">
              <div className="docs-section-head">
                <h2>Delivery Status</h2>
                <span className="badge">Status</span>
              </div>
              <ul className="docs-list">
                <li>Messages move through: queued {"->"} sending {"->"} sent or failed.</li>
                <li>Use <code>GET /v1/messages/:id</code> to check delivery status and errors.</li>
                <li>Delivery logs in the dashboard show queued/sent/failed records.</li>
                <li>Transient failures are retried with backoff before final failure.</li>
              </ul>
            </section>

            <section className="panel docs-section doc-reveal" id="troubleshooting">
              <div className="docs-section-head">
                <h2>Troubleshooting</h2>
                <span className="badge">Support</span>
              </div>
              <ul className="docs-list">
                <li>400 Bad Request: invalid payload, missing subject/text/html, or template errors.</li>
                <li>401 Unauthorized: missing or invalid API key/session.</li>
                <li>403 Forbidden: IP not allowed for this API key.</li>
                <li>404 Not Found: message ID does not exist for this API key.</li>
                <li>429 Too Many Requests: rate limit or daily quota exceeded.</li>
                <li>503 Queue Unavailable: Redis/worker not running.</li>
                <li>Template name errors: only lowercase letters, numbers, and hyphens are allowed.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
