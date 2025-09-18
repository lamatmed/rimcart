

import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
       const { userId } = auth() 
    const isAdmin = await authAdmin("user_32k4VZtsok2DBeHO9LDTwlZNM6F")
    if (!isAdmin) {
      return NextResponse.json({ error: "not autorisation" }, { status: 401 });
    }

  
    return NextResponse.json({isAdmin});
  } catch (error) {
    console.error(error)
     return NextResponse.json({error: error.code || error.message},{status:400})
  }
}
