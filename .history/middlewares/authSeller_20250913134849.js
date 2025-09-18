// middlewares/authSeller.js


export async function authSeller(userId) {
  try {
 
    // Récupérer le store de l'utilisateur
    const user = await prisma.store.findFirst({
      where: {
        userId: userId,
      },
      include: {
        // Inclure des relations si nécessaire
        // products: true,
        // orders: true,
      },
    });

    if (!store) {
      return {
        error: NextResponse.json(
          { message: "Store not found" },
          { status: 404 }
        )
      };
    }

    // Vérifier si le store est actif (si requis)
    if (requireActiveStore && !store.isActive) {
      return {
        error: NextResponse.json(
          { 
            message: "Store is not active",
            status: store.status 
          },
          { status: 403 }
        )
      };
    }

    // Vérifier si le store est approuvé (si requis)
    if (requireActiveStore && store.status !== "approved") {
      return {
        error: NextResponse.json(
          { 
            message: "Store is not approved",
            status: store.status 
          },
          { status: 403 }
        )
      };
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
