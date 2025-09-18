

import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    const isAdmin = await authAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: "not autorisation" }, { status: 401 });
    }

  
    return NextResponse.json({isAdmin});
  } catch (error) {
    console.error(error)
     return NextResponse.json({error: error.code || error.message},{status:400})
  }
}
