// middlewares/authSeller.js


export async function authSeller(userId) {
  try {
 
  
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
      include: {
        store: true,
       
      },
    });

    if (user.store) {
     if(user.store.status === 'approved'){
        return user.store.id
     }
    } else{
        return false
    }


  } catch (error) {
 
    return {
      error: NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      )
    };
  }
}
