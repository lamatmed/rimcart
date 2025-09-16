import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";

import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const isAdmin = await authAdmin;
    if (!isAdmin) {
      return NextResponse.json({ error: "not autorisation" }, { status: 401 });
    }

    const { storeId, status } = await req.json();
    if (status === "pending") {
      await prisma.store.update({
        where: { id: storeId },
        data: { status: "approved", isActive: true },
      });
    } else if (status === "rejected") {
      await prisma.store.update({
        where: { id: storeId },
        data: { status: "rejected" },
      });
    }
     return NextResponse.json({message: status + 'successfully'})
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

// ✅ GET : récupérer tous les stores pending & rejected
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
        status: {
          in: ["pending", "rejected"],
        },
      },
      include: {
        user: true, // 🔑 inclut toutes les infos du user lié au store
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    

    return NextResponse.json(stores);
  } catch (error) {
    console.error("[STORE_GET]", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}