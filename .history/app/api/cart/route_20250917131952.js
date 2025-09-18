import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const { cart } = await req.json();

    // Vérifie si l'user existe
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Crée l'utilisateur si besoin
      user = await prisma.user.create({
        data: {
          id: userId,
          email: "",   // tu peux remplir depuis Clerk si tu veux
          cart: cart || {},
        },
      });
    } else {
      // Sinon met juste à jour
      await prisma.user.update({
        where: { id: userId },
        data: { cart },
      });
    }

    return NextResponse.json({ message: "Cart updated" });
  } catch (error) {
    console.error("❌ POST /api/cart error:", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return NextResponse.json({ cart: user?.cart || {} });
  } catch (error) {
    console.error("❌ GET /api/cart error:", error);
    return NextResponse.json({ message: "Internal error" }, { status: 400 });
  }
}
