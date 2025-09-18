// app/api/admin/coupon/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";
import { inngest } from "@/inngest/client";

// ✅ GET : récupérer tous les coupons
export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("[COUPON_GET]", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch coupons" },
      { status: 400 }
    );
  }
}


export async function POST(req) {
  try {
    const { userId, has} = getAuth(req);
    const isAdmin = await authAdmin(userId);
    

  } catch (error) {
    
    return NextResponse.json(
      { error: error.message || error.code},
      { status: 400 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { userId } = getAuth(req);
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message || error.code},
      { status: 400 }
    );
  }
}

