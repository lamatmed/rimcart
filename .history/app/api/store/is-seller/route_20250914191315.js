
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req){
    try {
        const {userId} =  getAuth(req)
       const isSE
    } catch (error) {
        
    }
}