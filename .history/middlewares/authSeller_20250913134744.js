// middlewares/authSeller.js


export async function authSeller(userId) {
  try {
   
      };
    }

    // Récupérer le store de l'utilisateur
    const store = await prisma.store.findFirst({
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
    console.error("[AUTH_SELLER]", error);
    return {
      error: NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      )
    };
  }
}

/**
 * Middleware de haut niveau pour envelopper les handlers API
 * @param {Function} handler - Le handler API original
 * @param {Object} options - Options de configuration
 * @returns {Function} Handler enveloppé avec authentification
 */
export function withAuthSeller(handler, options = {}) {
  return async (req, ...args) => {
    const { requireActiveStore = true } = options;
    
    // Vérifier l'authentification
    const authResult = await authSeller(req, requireActiveStore);
    
    // Si erreur d'authentification, retourner la réponse d'erreur
    if (authResult.error) {
      return authResult.error;
    }
    
    // Ajouter les informations d'authentification à la requête
    req.userId = authResult.userId;
    req.store = authResult.store;
    
    // Appeler le handler original avec la requête modifiée
    return handler(req, ...args);
  };
}


export default function authSellerMiddleware(handler) {
  return withAuthSeller(handler, { requireActiveStore: true });
}