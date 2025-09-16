import { NextResponse } from "next/server"

export async function GET(req){
    try {
        const {searchParams} = new URL(req.url)
        const username = searchParams.get('username').toLowerCase()
        if(!username){
           return NextResponse.json
        }
    } catch (error) {
        
    }
}