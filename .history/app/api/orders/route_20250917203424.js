import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId,has } = getAuth(req);
     if (!userId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const {addressId, items,couponCoe} = await req.json();
     
    
     const newAddress = await prisma.address.create({ data: address});

    return NextResponse.json({newAddress, message: 'Address added successfully'});
  } catch (error) {
    return NextResponse.json({ error:error.code || error.message }, { status: 400 });
  }
}

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    const addresses = await prisma.address.findMany({
        where:{id: userId}
    })
    return NextResponse.json({addresses});
  } catch (error) {
   return NextResponse.json({ error:error.code || error.message }, { status: 400 });
  }
}
