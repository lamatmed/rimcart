import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ GET : récupérer uniquement les stores approuvés
export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    // Vérification admin
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const stores = await prisma.store.findMany({
      where: {
        status: "approved",
      },
      include: {
        user: true, // inclure les infos de l’utilisateur
      },
      orderBy: {
        createdAt: "desc",
      },
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
