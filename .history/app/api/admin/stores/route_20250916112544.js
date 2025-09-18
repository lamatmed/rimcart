// app/api/admin/stores/route.ts (ou .js)
import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
     
    });

    console.log("📦 STORES DB RESULT (approved):", stores.length, stores);
    return NextResponse.json({ stores }, { status: 200 });
  } catch (error) {
    console.error("[STORE_APPROVED_GET]", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
