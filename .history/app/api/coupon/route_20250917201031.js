import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId, has } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { code } = await req.json();
console.log("🔍 Checking coupon:", code);
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        expiresAt: { gt: new Date() },
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found or expired" }, { status: 404 });
    }

    if (coupon.forNewUser) {
      const userOrders = await prisma.order.findMany({ where: { userId } });
      if (userOrders.length > 0) {
        return NextResponse.json(
          { error: "This coupon is only for new users" },
          { status: 403 }
        );
      }
    }

    if (coupon.forMember) {
      const userOrders = await prisma.order.findFirst({ where: { userId } });
      if (!userOrders) {
        return NextResponse.json(
          { error: "This coupon is only available for members (existing customers)" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("❌ Coupon error:", error);
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 }
    );
  }
}
