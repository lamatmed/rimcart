// app/api/admin/coupon/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";

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

// ✅ POST : créer un coupon
export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      code,
      description,
      discount,
      forNewUser,
      forMember,
      isPublic,
      expiresAt,
    } = body;

    if (!code || !description || !discount || !expiresAt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        description,
        discount: parseFloat(discount),
        forNewUser: !!forNewUser,
        forMember: !!forMember,
        isPublic: !!isPublic,
        expiresAt: new Date(expiresAt),
      },
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("[COUPON_POST]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create coupon" },
      { status: 400 }
    );
  }
}

// ✅ DELETE : supprimer un coupon par code
export async function DELETE(req) {
  try {
    const { userId } = getAuth(req);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    await prisma.coupon.delete({
      where: { code },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[COUPON_DELETE]", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete coupon" },
      { status: 400 }
    );
  }
}
