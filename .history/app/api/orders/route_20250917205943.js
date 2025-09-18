import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId, has } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const { addressId, items, couponCode, payementMethod } = await req.json();

    if (!addressId || !items?.length || !payementMethod) {
      return NextResponse.json(
        { error: "Champs manquants ou invalides" },
        { status: 400 }
      );
    }
    let coupon = null;
    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: { code: couponCode},
      });
       if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 400 });
    }
    }

   
    if (couponCode && coupon.forNewUser) {
      const userorders = await prisma.order.findMany({ where: { userId } });
      if (userorders.length > 0) {
        return NextResponse.json(
          { error: "This coupon is only for new users" },
          { status: 403 }
        );
      }
    }
 const isPlusPlan = has({ plan: "plus" });
    if (couponCode && coupon.forMember) {
     

      if (!isPlusPlan) {
        return NextResponse.json(
          {
            error:
              "This coupon is only available for members (existing customers)",
          },
          { status: 403 }
        );
      }
    }
    const ordersByStore = new Map()
    for(const item of items){
      const  product = await prisma.product.findUnique({
        where:{id: item.id}
      })
      const storeId = product.storeId
      if(!ordersByStore.has(storeId))
    }
    return NextResponse.json({
     
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
   
  } catch (error) {
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
