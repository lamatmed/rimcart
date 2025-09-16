import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const authAdmin = async (userId) => {
  if (!userId) return false
  try {
    const user = await clerkClient.users.getUser(userId)

    const adminEmails = (process.env.ADMIN_EMAIL || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())

    const primaryEmail = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase()

    console.log("🔑 Admin emails:", adminEmails)
    console.log("📩 User email:", primaryEmail)

    return adminEmails.includes(primaryEmail)
  } catch (error) {
    console.error("❌ authAdmin error:", error)
    return false
  }
}

export async function GET() {
  try {
    const { userId } = auth() // ✅ nouvelle API Clerk
    console.log("👤 Clerk userId:", userId)

    const isAdmin = await authAdmin(userId)

    if (!isAdmin) {
      return NextResponse.json({ error: "not autorisation" }, { status: 401 })
    }

    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error("❌ API error:", error)
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    )
  }
}
