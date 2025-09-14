import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting simple seed...");

  // Hash password for seeded users
  const hashedPassword = await bcrypt.hash("password123", 12);

  // Create admin user
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: Role.ADMIN,
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  // Create writer user
  await prisma.user.upsert({
    where: { email: "writer@example.com" },
    update: {},
    create: {
      email: "writer@example.com",
      name: "Writer User",
      role: Role.WRITER,
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  // Create regular user
  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Regular User",
      role: Role.USER,
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  console.log("✅ Simple seed completed successfully!");
  console.log("👤 Users created:");
  console.log("  - admin@example.com (Admin)");
  console.log("  - writer@example.com (Writer)");
  console.log("  - user@example.com (User)");
  console.log("🔑 Default password: password123");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
