// middlewares/authSeller.js


export async function authSeller(userId) {
  try {
 
    // Récupérer le store de l'utilisateur
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
        
     }
    }


    // Retourner les informations d'authentification
    return {
      userId,
      store,
      nextResponse: null // Pas d'erreur
    };
  } catch (error) {
 
    return {
      error: NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      )
    };
  }
}
