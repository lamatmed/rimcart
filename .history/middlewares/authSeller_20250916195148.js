import prisma from '@/lib/prisma';

export async function authSeller(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,   // ✅ le champ de User est "id"
      },
      include: {
        store: true,
      },
    });

    if (user && user.store && user.store.status === 'approved') {
      return user.store;
    }
    
    return null;
  } catch (error) {
    console.error("Error in authSeller:", error);
    return null;
  }
}
