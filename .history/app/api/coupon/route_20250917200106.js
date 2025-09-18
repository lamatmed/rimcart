// app/api/admin/coupon/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";


export async function POST(req) {
  try {
    const { userId, has } =  getAuth(req);
    const {code = await req.json();

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase(), expiresAt: { gt: new Date() } },
    });
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    if (coupon.forNewUser) {
      const userorders = await prisma.order.findMany({ where: { userId } });
      if (userorders.length > 0) {
        return NextResponse.json(
          { error: "This coupon is only for new users" },
          { status: 403 }
        );
      }
    }

    if (coupon.forMember) {
        const hasPlusPlan = has({plan: 'plus'})
     

      if (!hasPlusPlan) {
        return NextResponse.json(
          {
            error:
              "This coupon is only available for members (existing customers)",
          },
          { status: 403 }
        );
      }
    }
    return NextResponse.json({coupon})
  } catch (error) {
    return NextResponse.json(
      { error: error.message || error.code },
      { status: 400 }
    );
  }
}

