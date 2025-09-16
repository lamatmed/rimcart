import { clerkClient } from '@clerk/nextjs/server'

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

export default authAdmin
