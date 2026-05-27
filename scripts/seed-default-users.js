const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const defaultPassword = process.env.SEED_DEFAULT_PASSWORD || "password123";

const defaultUsers = [
  {
    email: "admin@lenslab.test",
    name: "Admin LensLab",
    role: Role.ADMIN,
    className: null
  },
  {
    email: "mentor@lenslab.test",
    name: "Mentor Jurnalistik",
    role: Role.MENTOR,
    className: null
  },
  {
    email: "siswa@lenslab.test",
    name: "Siswa Demo",
    role: Role.STUDENT,
    className: "X-1"
  }
];

async function main() {
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  for (const user of defaultUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        className: user.className,
        passwordHash
      },
      create: {
        ...user,
        passwordHash
      }
    });
  }

  console.log(
    `Default users ready: admin@lenslab.test, mentor@lenslab.test, siswa@lenslab.test / ${defaultPassword}`
  );
}

main()
  .catch((error) => {
    console.error("Failed to seed default users:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
