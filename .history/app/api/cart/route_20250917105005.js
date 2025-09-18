import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { cart } = await req.json();

    await prisma.user.update({ where: { id: userId }, data: { cart: cart } });

    return NextResponse.json({message: 'Cart updated'});
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    const user = await prisma.user.findUnique()
    return NextResponse.json({message: 'Cart updated'});
  } catch (error) {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
