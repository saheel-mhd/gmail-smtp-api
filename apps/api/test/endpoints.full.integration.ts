process.env.SKIP_SMTP_VERIFY = "true";

import bcrypt from "bcryptjs";
import type inject from "light-my-request";

function extractCookie(setCookieHeaders: string[] | undefined, name: string): string {
  const source = setCookieHeaders ?? [];
  for (const header of source) {
    const firstPart = header.split(";")[0];
    if (firstPart.startsWith(`${name}=`)) {
      return firstPart;
    }
  }
  throw new Error(`missing cookie ${name}`);
}

function assertStatus(response: any, expected: number, label: string) {
  if (response.statusCode !== expected) {
    throw new Error(`${label} expected ${expected} got ${response.statusCode}: ${response.body}`);
  }
}

async function run() {
  const { prisma } = await import("../src/lib/prisma");
  const { buildApp } = await import("../src/index");
  const { env } = await import("../src/env");
  const app = buildApp();

  const live = (await app.inject({ method: "GET", url: "/health/live" })) as any;
  assertStatus(live, 200, "GET /health/live");

  const ready = (await app.inject({ method: "GET", url: "/health/ready" })) as any;
  if (ready.statusCode !== 200) {
    throw new Error(
      "GET /health/ready failed. Ensure database and Redis are running before tests."
    );
  }

  const stamp = Date.now();
  const email = `owner_${stamp}@example.com`;
  const tenant = await prisma.tenant.create({
    data: {
      name: `Tenant ${stamp}`,
      users: {
        create: {
          email,
          passwordHash: await bcrypt.hash("pass12345", 12),
          role: "owner"
        }
      }
    },
    include: { users: true }
  });

  try {
    const loginMissing = (await app.inject({
      method: "POST",
      url: "/admin/v1/auth/login",
      payload: {}
    })) as any;
    assertStatus(loginMissing, 400, "POST /admin/v1/auth/login missing");

    const loginBad = (await app.inject({
      method: "POST",
      url: "/admin/v1/auth/login",
      payload: { email, password: "wrong-pass" }
    })) as any;
    assertStatus(loginBad, 401, "POST /admin/v1/auth/login bad password");

    const login = (await app.inject({
      method: "POST",
      url: "/admin/v1/auth/login",
      payload: { email, password: "pass12345" }
    })) as any;
    assertStatus(login, 200, "POST /admin/v1/auth/login");

    const cookies = login.headers["set-cookie"] as string[] | undefined;
    const sessionCookie = extractCookie(cookies, env.SESSION_COOKIE_NAME);
    const csrfCookie = extractCookie(cookies, env.CSRF_COOKIE_NAME);
    const csrfValue = csrfCookie.split("=")[1];
    const cookieHeader = `${sessionCookie}; ${csrfCookie}`;
    const authHeaders = { cookie: cookieHeader, "x-csrf-token": csrfValue };

    const meUnauthorized = (await app.inject({
      method: "GET",
      url: "/admin/v1/me"
    })) as any;
    assertStatus(meUnauthorized, 401, "GET /admin/v1/me unauthorized");

    const me = (await app.inject({
      method: "GET",
      url: "/admin/v1/me",
      headers: { cookie: cookieHeader }
    })) as any;
    assertStatus(me, 200, "GET /admin/v1/me");

    const sendersListEmpty = (await app.inject({
      method: "GET",
      url: "/admin/v1/senders",
      headers: { cookie: cookieHeader }
    })) as any;
    assertStatus(sendersListEmpty, 200, "GET /admin/v1/senders");

    const createSenderInvalid = (await app.inject({
      method: "POST",
      url: "/admin/v1/senders",
      headers: authHeaders,
      payload: { label: "" }
    })) as any;
    assertStatus(createSenderInvalid, 400, "POST /admin/v1/senders invalid");

    const createSenderA = (await app.inject({
      method: "POST",
      url: "/admin/v1/senders",
      headers: authHeaders,
      payload: {
        type: "gmail",
        label: "Primary Sender",
        gmailAddress: `sender_${stamp}@example.com`,
        appPassword: "app-password-1234",
        perDayLimit: 1000
      }
    })) as any;
    assertStatus(createSenderA, 201, "POST /admin/v1/senders");
    const senderAId = createSenderA.json().data.id as string;

    const createSenderB = (await app.inject({
      method: "POST",
      url: "/admin/v1/senders",
      headers: authHeaders,
      payload: {
        type: "gmail",
        label: "Secondary Sender",
        gmailAddress: `senderb_${stamp}@example.com`,
        appPassword: "app-password-5678",
        perDayLimit: 1000
      }
    })) as any;
    assertStatus(createSenderB, 201, "POST /admin/v1/senders second");
    const senderBId = createSenderB.json().data.id as string;

    const patchSenderInvalid = (await app.inject({
      method: "PATCH",
      url: `/admin/v1/senders/${senderAId}`,
      headers: authHeaders,
      payload: { status: "unknown" }
    })) as any;
    assertStatus(patchSenderInvalid, 400, "PATCH /admin/v1/senders invalid");

    const patchSenderValid = (await app.inject({
      method: "PATCH",
      url: `/admin/v1/senders/${senderAId}`,
      headers: authHeaders,
      payload: { label: "Primary Sender Updated" }
    })) as any;
    assertStatus(patchSenderValid, 200, "PATCH /admin/v1/senders");

    const patchSenderMissing = (await app.inject({
      method: "PATCH",
      url: "/admin/v1/senders/does-not-exist",
      headers: authHeaders,
      payload: { label: "Missing" }
    })) as any;
    assertStatus(patchSenderMissing, 404, "PATCH /admin/v1/senders missing");

    const testSenderInvalid = (await app.inject({
      method: "POST",
      url: `/admin/v1/senders/${senderAId}/test`,
      headers: authHeaders,
      payload: {}
    })) as any;
    assertStatus(testSenderInvalid, 400, "POST /admin/v1/senders/:id/test invalid");

    const testSenderValid = (await app.inject({
      method: "POST",
      url: `/admin/v1/senders/${senderAId}/test`,
      headers: authHeaders,
      payload: { to: "recipient@example.com" }
    })) as any;
    assertStatus(testSenderValid, 200, "POST /admin/v1/senders/:id/test");

    const deleteSenderMissing = (await app.inject({
      method: "DELETE",
      url: "/admin/v1/senders/does-not-exist",
      headers: authHeaders
    })) as any;
    assertStatus(deleteSenderMissing, 404, "DELETE /admin/v1/senders missing");

    const deleteSenderValid = (await app.inject({
      method: "DELETE",
      url: `/admin/v1/senders/${senderBId}`,
      headers: authHeaders
    })) as any;
    assertStatus(deleteSenderValid, 200, "DELETE /admin/v1/senders");

    const templateList = (await app.inject({
      method: "GET",
      url: "/admin/v1/templates",
      headers: { cookie: cookieHeader }
    })) as any;
    assertStatus(templateList, 200, "GET /admin/v1/templates");

    const createTemplateInvalid = (await app.inject({
      method: "POST",
      url: "/admin/v1/templates",
      headers: authHeaders,
      payload: { name: "" }
    })) as any;
    assertStatus(createTemplateInvalid, 400, "POST /admin/v1/templates invalid");

    const createTemplateA = (await app.inject({
      method: "POST",
      url: "/admin/v1/templates",
      headers: authHeaders,
      payload: {
        name: "Welcome Template",
        subject: "Welcome {{firstName}}",
        html: "<h1>Hello {{firstName}}</h1>",
        text: "Hello {{firstName}}"
      }
    })) as any;
    assertStatus(createTemplateA, 201, "POST /admin/v1/templates");
    const templateAId = createTemplateA.json().data.id as string;

    const createTemplateB = (await app.inject({
      method: "POST",
      url: "/admin/v1/templates",
      headers: authHeaders,
      payload: {
        name: "Disabled Template",
        subject: "Disabled {{firstName}}",
        html: "<p>Disabled {{firstName}}</p>",
        text: "Disabled {{firstName}}"
      }
    })) as any;
    assertStatus(createTemplateB, 201, "POST /admin/v1/templates second");
    const templateBId = createTemplateB.json().data.id as string;

    const patchTemplateInvalid = (await app.inject({
      method: "PATCH",
      url: `/admin/v1/templates/${templateAId}`,
      headers: authHeaders,
      payload: { status: "unknown" }
    })) as any;
    assertStatus(patchTemplateInvalid, 400, "PATCH /admin/v1/templates invalid");

    const patchTemplateValid = (await app.inject({
      method: "PATCH",
      url: `/admin/v1/templates/${templateAId}`,
      headers: authHeaders,
      payload: { subject: "Welcome Back {{firstName}}" }
    })) as any;
    assertStatus(patchTemplateValid, 200, "PATCH /admin/v1/templates");

    const deleteTemplateMissing = (await app.inject({
      method: "DELETE",
      url: "/admin/v1/templates/does-not-exist",
      headers: authHeaders
    })) as any;
    assertStatus(deleteTemplateMissing, 404, "DELETE /admin/v1/templates missing");

    const deleteTemplateValid = (await app.inject({
      method: "DELETE",
      url: `/admin/v1/templates/${templateBId}`,
      headers: authHeaders
    })) as any;
    assertStatus(deleteTemplateValid, 200, "DELETE /admin/v1/templates");

    const apiKeyList = (await app.inject({
      method: "GET",
      url: "/admin/v1/api-keys",
      headers: { cookie: cookieHeader }
    })) as any;
    assertStatus(apiKeyList, 200, "GET /admin/v1/api-keys");

    const createKeyInvalid = (await app.inject({
      method: "POST",
      url: "/admin/v1/api-keys",
      headers: authHeaders,
      payload: { name: "Bad Key", smtpAccountIds: [] }
    })) as any;
    assertStatus(createKeyInvalid, 400, "POST /admin/v1/api-keys invalid");

    const createKeyInvalidSender = (await app.inject({
      method: "POST",
      url: "/admin/v1/api-keys",
      headers: authHeaders,
      payload: { name: "Bad Key", smtpAccountIds: ["does-not-exist"] }
    })) as any;
    assertStatus(createKeyInvalidSender, 400, "POST /admin/v1/api-keys invalid sender");

    const createKeyA = (await app.inject({
      method: "POST",
      url: "/admin/v1/api-keys",
      headers: authHeaders,
      payload: { name: "Primary Key", smtpAccountIds: [senderAId], rateLimitPerMinute: 120 }
    })) as any;
    assertStatus(createKeyA, 201, "POST /admin/v1/api-keys");
    const keyAData = createKeyA.json().data as { id: string; key: string };
    let apiToken = keyAData.key;
    const apiKeyId = keyAData.id;

    const createKeyB = (await app.inject({
      method: "POST",
      url: "/admin/v1/api-keys",
      headers: authHeaders,
      payload: { name: "Secondary Key", smtpAccountIds: [senderAId] }
    })) as any;
    assertStatus(createKeyB, 201, "POST /admin/v1/api-keys second");
    const keyBId = createKeyB.json().data.id as string;

    const rotateMissing = (await app.inject({
      method: "POST",
      url: "/admin/v1/api-keys/does-not-exist/rotate",
      headers: authHeaders
    })) as any;
    assertStatus(rotateMissing, 404, "POST /admin/v1/api-keys/:id/rotate missing");

    const revokeMissing = (await app.inject({
      method: "DELETE",
      url: "/admin/v1/api-keys/does-not-exist",
      headers: authHeaders
    })) as any;
    assertStatus(revokeMissing, 404, "DELETE /admin/v1/api-keys/:id missing");

    const publicSendersMissingAuth = (await app.inject({
      method: "GET",
      url: "/v1/senders"
    })) as any;
    assertStatus(publicSendersMissingAuth, 401, "GET /v1/senders missing auth");

    const publicSendersInvalidAuth = (await app.inject({
      method: "GET",
      url: "/v1/senders",
      headers: { authorization: "Bearer invalid" }
    })) as any;
    assertStatus(publicSendersInvalidAuth, 401, "GET /v1/senders invalid auth");

    const publicSenders = (await app.inject({
      method: "GET",
      url: "/v1/senders",
      headers: { authorization: `Bearer ${apiToken}` }
    })) as any;
    assertStatus(publicSenders, 200, "GET /v1/senders");

    const sendInvalidBody = (await app.inject({
      method: "POST",
      url: "/v1/send",
      headers: { authorization: `Bearer ${apiToken}` },
      payload: {}
    })) as any;
    assertStatus(sendInvalidBody, 400, "POST /v1/send invalid body");

    const sendWrongSender = (await app.inject({
      method: "POST",
      url: "/v1/send",
      headers: { authorization: `Bearer ${apiToken}` },
      payload: {
        senderId: "invalid-sender",
        idempotencyKey: `bad-sender-${stamp}`,
        to: ["recipient@example.com"],
        subject: "Hello",
        text: "Hello"
      }
    })) as any;
    assertStatus(sendWrongSender, 403, "POST /v1/send wrong sender");

    const sendTooManyRecipients = (await app.inject({
      method: "POST",
      url: "/v1/send",
      headers: { authorization: `Bearer ${apiToken}` },
      payload: {
        senderId: senderAId,
        idempotencyKey: `too-many-${stamp}`,
        to: Array.from({ length: 11 }).map((_, idx) => `person${idx}@example.com`),
        subject: "Hello",
        text: "Hello"
      }
    })) as any;
    assertStatus(sendTooManyRecipients, 400, "POST /v1/send too many");

    const sendTemplateMissingVars = (await app.inject({
      method: "POST",
      url: "/v1/send",
      headers: { authorization: `Bearer ${apiToken}` },
      payload: {
        senderId: senderAId,
        idempotencyKey: `missing-vars-${stamp}`,
        to: ["recipient@example.com"],
        templateId: templateAId,
        variables: {}
      }
    })) as any;
    assertStatus(sendTemplateMissingVars, 400, "POST /v1/send missing variables");

    const sendTemplateValid = (await app.inject({
      method: "POST",
      url: "/v1/send",
      headers: { authorization: `Bearer ${apiToken}` },
      payload: {
        senderId: senderAId,
        idempotencyKey: `template-ok-${stamp}`,
        to: ["recipient@example.com"],
        templateId: templateAId,
        variables: { firstName: "Tester" }
      }
    })) as any;
    assertStatus(sendTemplateValid, 202, "POST /v1/send template");
    const messageId = sendTemplateValid.json().messageId as string;

    const messageMissingAuth = (await app.inject({
      method: "GET",
      url: `/v1/messages/${messageId}`
    })) as any;
    assertStatus(messageMissingAuth, 401, "GET /v1/messages missing auth");

    const messageInvalid = (await app.inject({
      method: "GET",
      url: "/v1/messages/does-not-exist",
      headers: { authorization: `Bearer ${apiToken}` }
    })) as any;
    assertStatus(messageInvalid, 404, "GET /v1/messages missing");

    const messageValid = (await app.inject({
      method: "GET",
      url: `/v1/messages/${messageId}`,
      headers: { authorization: `Bearer ${apiToken}` }
    })) as any;
    assertStatus(messageValid, 200, "GET /v1/messages");

    const testApiInvalid = (await app.inject({
      method: "POST",
      url: "/admin/v1/test-api/send",
      headers: authHeaders,
      payload: {}
    })) as any;
    assertStatus(testApiInvalid, 400, "POST /admin/v1/test-api/send invalid");

    const testApiValid = (await app.inject({
      method: "POST",
      url: "/admin/v1/test-api/send",
      headers: authHeaders,
      payload: {
        apiKeyId,
        senderId: senderAId,
        toEmail: "recipient@example.com",
        subject: "Test"
      }
    })) as any;
    assertStatus(testApiValid, 202, "POST /admin/v1/test-api/send");

    const rotateValid = (await app.inject({
      method: "POST",
      url: `/admin/v1/api-keys/${apiKeyId}/rotate`,
      headers: authHeaders
    })) as any;
    assertStatus(rotateValid, 200, "POST /admin/v1/api-keys/:id/rotate");
    apiToken = rotateValid.json().data.key as string;

    const revokeValid = (await app.inject({
      method: "DELETE",
      url: `/admin/v1/api-keys/${keyBId}`,
      headers: authHeaders
    })) as any;
    assertStatus(revokeValid, 200, "DELETE /admin/v1/api-keys/:id");

    const logs = (await app.inject({
      method: "GET",
      url: "/admin/v1/logs?limit=20",
      headers: { cookie: cookieHeader }
    })) as any;
    assertStatus(logs, 200, "GET /admin/v1/logs");

    const emailLogs = (await app.inject({
      method: "GET",
      url: "/admin/v1/email-logs?limit=20",
      headers: { cookie: cookieHeader }
    })) as any;
    assertStatus(emailLogs, 200, "GET /admin/v1/email-logs");

    const systemLogs = (await app.inject({
      method: "GET",
      url: "/admin/v1/system-logs?limit=20",
      headers: { cookie: cookieHeader }
    })) as any;
    assertStatus(systemLogs, 200, "GET /admin/v1/system-logs");

    const logoutMissingCsrf = (await app.inject({
      method: "POST",
      url: "/admin/v1/auth/logout",
      headers: { cookie: cookieHeader }
    })) as any;
    assertStatus(logoutMissingCsrf, 403, "POST /admin/v1/auth/logout missing csrf");

    const logoutValid = (await app.inject({
      method: "POST",
      url: "/admin/v1/auth/logout",
      headers: authHeaders
    })) as any;
    assertStatus(logoutValid, 200, "POST /admin/v1/auth/logout");

    console.log("full endpoint integration checks passed");
  } finally {
    await prisma.tenant.delete({ where: { id: tenant.id } });
    await app.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
