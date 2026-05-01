import { buildApp } from "../src/index";

type Case = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  url: string;
  payload?: unknown;
  expectedStatus: number;
};

const cases: Case[] = [
  { method: "GET", url: "/health/live", expectedStatus: 200 },
  { method: "GET", url: "/v1/senders", expectedStatus: 401 },
  { method: "POST", url: "/v1/send", payload: {}, expectedStatus: 401 },
  { method: "GET", url: "/v1/messages/abc", expectedStatus: 401 },
  { method: "POST", url: "/admin/v1/auth/login", payload: {}, expectedStatus: 400 },
  // forgot-password is intentionally public + always returns 200 to avoid email enumeration
  { method: "POST", url: "/admin/v1/auth/forgot-password", payload: { email: "nope@example.com" }, expectedStatus: 200 },
  { method: "POST", url: "/admin/v1/auth/reset-password", payload: {}, expectedStatus: 400 },
  // register/start: invalid payload → 400
  { method: "POST", url: "/admin/v1/auth/register/start", payload: {}, expectedStatus: 400 },
  // register/verify: missing payload → 400
  { method: "POST", url: "/admin/v1/auth/register/verify", payload: {}, expectedStatus: 400 },
  // template preview / test-send (auth required)
  { method: "POST", url: "/admin/v1/templates/preview", payload: {}, expectedStatus: 401 },
  { method: "POST", url: "/admin/v1/templates/test-send", payload: {}, expectedStatus: 401 },
  { method: "GET", url: "/admin/v1/me", expectedStatus: 401 },
  { method: "POST", url: "/admin/v1/account/password", payload: {}, expectedStatus: 401 },
  { method: "POST", url: "/admin/v1/account/mfa/init", payload: {}, expectedStatus: 401 },
  { method: "POST", url: "/admin/v1/account/mfa/enable", payload: {}, expectedStatus: 401 },
  { method: "POST", url: "/admin/v1/account/mfa/disable", payload: {}, expectedStatus: 401 },
  { method: "GET", url: "/admin/v1/members", expectedStatus: 401 },
  { method: "POST", url: "/admin/v1/members", payload: {}, expectedStatus: 401 },
  { method: "PATCH", url: "/admin/v1/members/abc/role", payload: {}, expectedStatus: 401 },
  { method: "POST", url: "/admin/v1/members/abc/reset-password", payload: {}, expectedStatus: 401 },
  { method: "DELETE", url: "/admin/v1/members/abc", expectedStatus: 401 },
  { method: "GET", url: "/admin/v1/senders", expectedStatus: 401 },
  { method: "POST", url: "/admin/v1/senders", payload: {}, expectedStatus: 401 },
  { method: "PATCH", url: "/admin/v1/senders/abc", payload: {}, expectedStatus: 401 },
  { method: "DELETE", url: "/admin/v1/senders/abc", expectedStatus: 401 },
  {
    method: "POST",
    url: "/admin/v1/senders/abc/test",
    payload: {},
    expectedStatus: 401
  },
  {
    method: "POST",
    url: "/admin/v1/test-api/send",
    payload: {},
    expectedStatus: 401
  },
  { method: "GET", url: "/admin/v1/domains", expectedStatus: 401 },
  {
    method: "POST",
    url: "/admin/v1/domains",
    payload: {},
    expectedStatus: 401
  },
  {
    method: "POST",
    url: "/admin/v1/domains/abc/verify",
    payload: {},
    expectedStatus: 401
  },
  { method: "GET", url: "/admin/v1/api-keys", expectedStatus: 401 },
  { method: "POST", url: "/admin/v1/api-keys", payload: {}, expectedStatus: 401 },
  {
    method: "POST",
    url: "/admin/v1/api-keys/abc/rotate",
    payload: {},
    expectedStatus: 401
  },
  { method: "DELETE", url: "/admin/v1/api-keys/abc", expectedStatus: 401 },
  { method: "GET", url: "/admin/v1/logs", expectedStatus: 401 }
];

async function run() {
  const app = buildApp();

  for (const item of cases) {
    const response = await app.inject({
      method: item.method,
      url: item.url,
      payload: item.payload as any
    });
    if (response.statusCode !== item.expectedStatus) {
      throw new Error(
        `${item.method} ${item.url} expected ${item.expectedStatus} got ${response.statusCode}`
      );
    }
    console.log(`${item.method} ${item.url} -> ${response.statusCode}`);
  }

  await app.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
