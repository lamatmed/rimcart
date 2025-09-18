import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const usernameParam = searchParams.get("username");

    if (!usernameParam) {
      return NextResponse.json({ error: "Missing username" }, { status: 400 });
    }

    const username = usernameParam.replace(/\s+/g, "").toLowerCase();

    const store = await prisma.store.findFirst({
      where: {
        username,
        isActive: true,
      },
      include: {
        Product: { include: { rating: true } },
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({ store });

  } catch (error) {
    console.error("❌ /api/store/data error:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 }
    );
  }
}
