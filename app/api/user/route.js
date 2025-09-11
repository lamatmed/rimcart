import prisma from "@/lib/prisma.js";

export async function POST(req) {
  try {
    const body = await req.json();

    const user = await prisma.user.create({
      data: {
        id: body.id, // par ex. un uuid ou un string unique
        email: body.email,
        name: body.name ?? null,
        image: body.image ?? null,
        cart: body.cart ?? {},
      },
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
