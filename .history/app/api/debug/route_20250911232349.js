import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return new Response(JSON.stringify(users, null, 2), { status: 200 });
  } catch (err) {
    console.error("❌ Prisma error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
