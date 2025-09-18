
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// GET - Récupérer le produits de store active et inStock
export async function GET(req) {
  try {
   

    let products = await prisma.product.findMany({ where: { inStock:true },
    include:{
        rating:{
            select:{
                createdAt:true,
                rating:true,
                review:true,
                user:{
                    select:{
                        name:true,
                        image:true
                    }
                }
            }
        },
        store:true,
    }, 
orderBy:{
    createdAt: 'desc'
}});
products = products.filter(product =>product.store.isActive)
   

    return NextResponse.json({  products });
  } catch (error) {
    
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
