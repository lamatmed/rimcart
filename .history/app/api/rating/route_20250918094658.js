import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    // Auth
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Body
    const { rating, review, productId, orderId } = await req.json();

    if (!rating || !review || !productId || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const order = await prisma.order.findUnique({
      where: { id: orderId, userId },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isAlreadyRated = await prisma.rating.findFirst({
      where: { productId, orderId },
    });
    if (isAlreadyRated) {
      return NextResponse.json({ error: "You have already rated this product in this order" }, { status: 403 });
    }
    // Create Rating
    const newRating = await prisma.rating.create({
      data: {
        rating,
        review,
        userId,
        productId,
        orderId,
      },
    });

    return NextResponse.json({ message:'Rat', rating: newRating }, { status: 201 });
  } catch (error) {
    console.error("❌ Error in POST /api/rating:", error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
