import prisma from "@/lib/prisma";
import { authAdmin } from "@/middlewares/";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    const isAdmin = await authSeller(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "not autorisation" }, { status: 401 });
    }

    const storeInfo = await prisma.store.findUnique({
      where: userId,
    });
    return NextResponse.json({isSeller, storeInfo});
  } catch (error) {
    console.error(error)
     return NextResponse.json({error: error.code || error.message},{status:400})
  }
}
