const { clerkClient } = require("@clerk/nextjs/server")

const  authAdmin = async (userId) =>{
try {
    if(!userId) return false
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    return pro
} catch (error) {
    
}
}