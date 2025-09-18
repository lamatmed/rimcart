import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("📩 Données reçues pour insert manuel:", body);

    const user = await prisma.user.create({
      data: {
        id: body.id,
        email: body.email,
        name: body.name ?? null,
        image: body.image ?? null,
        cart: body.cart ?? {},
      },
    });

    console.log("✅ User inséré:", user);
    return new Response(JSON.stringify(user), { status: 201 });
  } catch (err) {
    console.error("❌ Erreur Prisma:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// GET: liste tous les users
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return new Response(JSON.stringify(users, null, 2), { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
