import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authSeller } from "@/middlewares/authSeller";
import Orders from "@/app/(public)/orders/page";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const store = await authSeller(userId);
    if (!store) {
      return NextResponse.json({ message: "Store not authorized " }, { status: 404 });
    }

    const { orderId , status} = await req.json();

   

  await prisma.order.update({
      where: { id: orderId, storeId: store.id },
      data:{status}
    });

  
 return NextResponse.json({ message: "Order status Updated " }, { status: 201 });
    
  } catch (error) {
   
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}



export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthenticated" },
        { status: 401 }
      );
    }

  
    const store = await authSeller(userId);
    
    if (!store) {
     return NextResponse.json({ message: "Store not authorized " }, { status: 404 });
    }

   
  
  
    const orders = await prisma.order.findMany({
      where: {
        storeId: store.id,
      },
      include: {
        user: true,
        address  
      },
    });

   

    return NextResponse.json(orders);
  } catch (error) {
   
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}