import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const tenantName = process.env.BOOTSTRAP_TENANT_NAME;
  const email = process.env.BOOTSTRAP_OWNER_EMAIL;
  const password = process.env.BOOTSTRAP_OWNER_PASSWORD;
  if (!tenantName || !email || !password) {
    throw new Error(
      "BOOTSTRAP_TENANT_NAME, BOOTSTRAP_OWNER_EMAIL and BOOTSTRAP_OWNER_PASSWORD are required"
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const tenant = await prisma.tenant.create({
    data: {
      name: tenantName,
      users: {
        create: {
          email,
          passwordHash,
          role: "owner"
        }
      }
    },
    include: {
      users: true
    }
  });

  console.log(
    JSON.stringify(
      {
        tenantId: tenant.id,
        ownerId: tenant.users[0]?.id,
        email
      },
      null,
      2
    )
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
