
import { authSeller } from "@/middlewares/authSeller"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req){
    try {
        const {userId} =  getAuth(req)
       const isSeller = await authSeller(userId)
       if(!isSeller){
  return NextResponse.json
       }
    } catch (error) {
        
    }
}