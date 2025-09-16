import prisma from "@/lib/prisma";
import { authSeller } from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const isSeller = await 
    if (!isSeller) {
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
