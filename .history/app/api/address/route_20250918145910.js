import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const newAddress = await prisma.address.create({
      data: {
        ...body,
        userId, // toujours lier à l’utilisateur connecté
      },
    });

    return NextResponse.json({
      newAddress,
      message: "Address added successfully",
    });
  } catch (error) {
    console.error("❌ Error in POST /api/address:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}





export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
     
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("❌ Error in GET /api/address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}