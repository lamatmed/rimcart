import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// GET - Récupérer le produits de store active et inStock
export async function POST(req) {
  try {
   

   
   

    return NextResponse.json({  products });
  } catch (error) {
    
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
