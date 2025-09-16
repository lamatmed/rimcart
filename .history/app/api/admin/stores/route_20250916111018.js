import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    // ✅ Vérif admin
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // ✅ Récupérer les stores approuvés
    const stores = await prisma.store.findMany({
      where: { status: {"pending" },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    console.log("📦 STORES DB RESULT:", stores); // 👈 debug terminal

    // ✅ Toujours renvoyer un objet avec "stores"
    return NextResponse.json({ stores });
  } catch (error) {
    console.error("[STORE_APPROVED_GET]", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
