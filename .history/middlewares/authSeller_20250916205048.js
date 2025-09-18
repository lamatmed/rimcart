import prisma from '@/lib/prisma';

export async function authSeller(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { store: true },
    });

    console.log("DEBUG user:", user);

    if (user && user.store && user.store.status === 'approved') {
      return user.store.id; // <-- retourne uniquement l'ID du store
    }
    
    console.log("DEBUG authSeller: not approved or no store");
    return null;
  } catch (error) {
    console.error("Error in authSeller:", error);
    return null;
  }
}
