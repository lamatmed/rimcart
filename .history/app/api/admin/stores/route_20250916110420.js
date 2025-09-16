import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ GET : récupérer uniquement les stores approuvés
export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const stores = await prisma.store.findMany({
      where: { status: "approved" },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ stores });
  } catch (error) {
    console.error("[STORE_APPROVED_GET]", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

// ✅ POST : créer un store
export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Store name is required" },
        { status: 400 }
      );
    }

    const store = await prisma.store.create({
      data: {
        name,
        description,
        status: "approved", // 👈 direct approuvé pour tests
        userId, // admin créateur
      },
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch (error) {
    console.error("[STORE_CREATE_POST]", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
