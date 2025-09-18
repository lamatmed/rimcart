import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";



export async function POST(req) {
  try {
    const {userId} = getAuth(req)
    const {cart} = await req.json()
   
   await prisma.user.update({})

    return NextResponse.json({ });
  } catch (error) {
    
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
