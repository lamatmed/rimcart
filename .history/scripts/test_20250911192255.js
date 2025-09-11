import prisma from "../lib/prisma";

async function main() {
  console.log("🔗 Testing DB connection...");

  const user = await prisma.user.create({
    data: {
      id: "test123",
      email: "test@example.com",
      name: "Test User",
      image: "https://placehold.co/200x200",
    },
  });
  console.log("✅ Inserted:", user);

  const all = await prisma.user.findMany();
  console.log("📦 All users:", all);
}

main()
  .catch((err) => {
    console.error("❌ Error:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
