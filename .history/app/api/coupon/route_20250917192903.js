// app/api/admin/coupon/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";
import { inngest } from "@/inngest/client";


export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    
  } catch (error) {
   
    return NextResponse.json(
      { error: error.message || error.code},
      { status: 400 }
    );
  }
}


export async function POST(req) {
  try {
    const { userId, has} = getAuth(req);
    const {code} = await req.json()
    
 const coupon = await prisma.coupon.findUnique({
    where:{code : code.toUpperCase(),
        expiresAt:{gt: new Date()}
    }
 })
    if(!coupon){
        return NextResponse.json({error: 'Coupon not found'}, {status: 404})
    }
     if()
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

