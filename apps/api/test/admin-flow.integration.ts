process.env.SKIP_SMTP_VERIFY = "true";

import type inject from "light-my-request";
import bcrypt from "bcryptjs";

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

async function run() {
  const { prisma } = await import("../src/lib/prisma");
  const { buildApp } = await import("../src/index");
  const app = buildApp();
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
    const login = (await app.inject({
      method: "POST",
      url: "/admin/v1/auth/login",
      payload: {
        email,
        password: "pass12345"
      }
    })) as inject.Response;
    if (login.statusCode !== 200) {
      throw new Error(`login failed ${login.statusCode}: ${login.body}`);
    }

    const cookies = login.headers["set-cookie"] as string[] | undefined;
    const sessionCookie = extractCookie(cookies, "gmail_smtp_session");
    const csrfCookie = extractCookie(cookies, "gmail_smtp_csrf");
    const csrfValue = csrfCookie.split("=")[1];
    const cookieHeader = `${sessionCookie}; ${csrfCookie}`;

    const me = (await app.inject({
      method: "GET",
      url: "/admin/v1/me",
      headers: { cookie: cookieHeader }
    })) as inject.Response;
    if (me.statusCode !== 200) throw new Error(`/admin/v1/me failed: ${me.statusCode}`);

    const createSender = (await app.inject({
      method: "POST",
      url: "/admin/v1/senders",
      headers: {
        cookie: cookieHeader,
        "x-csrf-token": csrfValue
      },
      payload: {
        label: "Primary",
        gmailAddress: "sender@example.com",
        appPassword: "app-password-1234",
        perMinuteLimit: 60,
        perDayLimit: 1000
      }
    })) as inject.Response;
    if (createSender.statusCode !== 201) {
      throw new Error(`/admin/v1/senders failed: ${createSender.statusCode} ${createSender.body}`);
    }
    const senderId = createSender.json().data.id as string;

    const createKey = (await app.inject({
      method: "POST",
      url: "/admin/v1/api-keys",
      headers: {
        cookie: cookieHeader,
        "x-csrf-token": csrfValue
      },
      payload: {
        name: "Integration key",
        smtpAccountIds: [senderId],
        rateLimitPerMinute: 100
      }
    })) as inject.Response;
    if (createKey.statusCode !== 201) {
      throw new Error(`/admin/v1/api-keys failed: ${createKey.statusCode} ${createKey.body}`);
    }
    const apiToken = createKey.json().data.key as string;

    const publicSenders = (await app.inject({
      method: "GET",
      url: "/v1/senders",
      headers: {
        authorization: `Bearer ${apiToken}`
      }
    })) as inject.Response;
    if (publicSenders.statusCode !== 200) {
      throw new Error(`/v1/senders failed: ${publicSenders.statusCode} ${publicSenders.body}`);
    }

    const logs = (await app.inject({
      method: "GET",
      url: "/admin/v1/logs",
      headers: {
        cookie: cookieHeader
      }
    })) as inject.Response;
    if (logs.statusCode !== 200) {
      throw new Error(`/admin/v1/logs failed: ${logs.statusCode}`);
    }

    console.log("admin integration flow passed");
  } finally {
    await prisma.tenant.delete({ where: { id: tenant.id } });
    await app.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
