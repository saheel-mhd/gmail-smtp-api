# Gmail SMTP API

Multi-tenant Gmail SMTP API with queue-backed sending, scoped API keys, sender throttles, audit logs, and a Next.js admin dashboard.

## Stack

- Web: Next.js (`apps/web`)
- API: Fastify + Prisma + Zod (`apps/api`)
- Worker: BullMQ + Nodemailer (`apps/worker`)
- Data: PostgreSQL
- Queue/Rate limit: Redis

## Services and architecture

- API receives `POST /v1/send`, validates, enqueues to Redis/BullMQ, and responds quickly (`202 queued`).
- Worker consumes queue and performs SMTP delivery with retry classification.
- Dashboard uses admin endpoints for sender and API key management.

## Quick start

1. Copy env file:
```bash
cp .env.example .env
```
2. Start infrastructure:
```bash
docker compose up -d postgres redis
```
3. Install dependencies:
```bash
npm install
```
4. Generate Prisma client and migrate:
```bash
npm run prisma:generate -w @gmail-smtp/api
npm run prisma:migrate -w @gmail-smtp/api
```
5. Create owner account:
```bash
BOOTSTRAP_TENANT_NAME=Acme BOOTSTRAP_OWNER_EMAIL=owner@acme.com BOOTSTRAP_OWNER_PASSWORD=changeMe123! npm run bootstrap:owner -w @gmail-smtp/api
```
6. Run services:
```bash
npm run dev:api
npm run dev:worker
npm run dev:web
```

## Public API

- `POST /v1/send`
- `GET /v1/messages/:id`
- `GET /v1/senders`

Auth header:
```http
Authorization: Bearer <api_key>
```

Send example:
```bash
curl -X POST http://localhost:4000/v1/send \
  -H "Authorization: Bearer gsk_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId":"sender_cuid",
    "idempotencyKey":"order-10001-email-v1",
    "to":["user@example.com"],
    "subject":"Welcome",
    "text":"hello from queue-backed api"
  }'
```

## Admin API

- Auth: `POST /admin/v1/auth/login`, `POST /admin/v1/auth/logout`, `GET /admin/v1/me`
- Senders: `GET/POST/PATCH/DELETE /admin/v1/senders`, `POST /admin/v1/senders/:id/test`
- API keys: `GET/POST /admin/v1/api-keys`, `POST /admin/v1/api-keys/:id/rotate`, `DELETE /admin/v1/api-keys/:id`
- Logs: `GET /admin/v1/logs`

Mutating admin routes require CSRF header:
```http
x-csrf-token: <csrf_token>
```

## Endpoint smoke checks

Run:
```bash
npm run test:endpoints
```

This checks route registration and auth/security gate behavior for all defined endpoints.

## Railway deployment

Recommended setup is web proxying to API over Railway private networking (no CORS).

1. Create three services from the monorepo: `web`, `api`, `worker`.
2. Add PostgreSQL and Redis services.
3. Generate a public domain for the `web` service (Settings → Networking).
4. Set env vars:

API service:
```text
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
APP_BASE_URL=https://<web-public-domain>
JWT_SECRET=<long random string>
ENCRYPTION_MASTER_KEY=<64 hex chars>
```

Worker service:
```text
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
```

Web service:
```text
API_PROXY_TARGET=http://${{api.RAILWAY_PRIVATE_DOMAIN}}:${{api.PORT}}
```

Notes:
- The API reads `PORT` automatically if `API_PORT` isn’t set.
- The web service should not call the API directly unless you also set CORS (`APP_BASE_URL`).
