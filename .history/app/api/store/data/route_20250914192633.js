
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req){
    try {
        const {searchParams} = new URL(req.url)
        const username = searchParams.get('username').toLowerCase()
        if(!username){
           return NextResponse.json({error:'Missing usrname'})
        }
     const store = prisma.store.findUnique({
        where:{username, isActive:true},
        include:{Product:{include:{rating:t}}}
     })

    } catch (error) {
         console.error(error)
     return NextResponse.json({error: error.code || error.message},{status:400})
    }
}