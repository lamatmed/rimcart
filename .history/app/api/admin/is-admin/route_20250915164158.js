export async function GET(req) {
  try {
    const { userId } = getAuth(req)

    console.log("👤 Clerk userId:", userId)

    const isAdmin = await authAdmin(userId)
    if (!isAdmin) {
      return NextResponse.json({ error: "not autorisation" }, { status: 401 })
    }

    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    )
  }
}
