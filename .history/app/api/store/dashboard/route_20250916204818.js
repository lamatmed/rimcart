import prisma from "@/lib/prisma";
import { authSeller } from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // Vérifier que l'utilisateur est seller et récupérer son storeId
    const storeId = await authSeller(userId);
    if (!storeId) {
      return NextResponse.json({ error: "Not a seller or store not found" }, { status: 403 });
    }

    // Récupérer les orders du store
    const orders = await prisma.order.findMany({
      where: { storeId },
    });

    // Récupérer les produits du store
    const products = await prisma.product.findMany({
      where: { storeId },
    });

    // Récupérer les ratings des produits du store
    const ratings = await prisma.rating.findMany({
      where: { productId: { in: products.map((p) => p.id) } },
      include: { user: true, product: true },
    });

    // Calculer les données du dashboard
    const totalEarnings = Math.round(
      orders.reduce((acc, order) => acc + order.total, 0)
    );

    const dashboardData = {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalEarnings,
      ratings,
    };

    return NextResponse.json({ dashboardData });
  } catch (error) {
    console.error("[DASHBOARD_GET]", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
