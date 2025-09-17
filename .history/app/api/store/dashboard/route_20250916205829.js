import prisma from "@/lib/prisma";
import { authSeller } from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        {
          dashboardData: {
            totalProducts: 0,
            totalEarnings: 0,
            totalOrders: 0,
            ratings: [],
          },
        },
        { status: 401 }
      );
    }

    const store = await authSeller(userId);

    if (!store) {
      // Pas de store approuvé
      return NextResponse.json({
        dashboardData: {
          totalProducts: 0,
          totalEarnings: 0,
          totalOrders: 0,
          ratings: [],
        },
      });
    }

    // Récupérer les orders et products du store
    const [orders, products] = await Promise.all([
      prisma.order.findMany({ where: { storeId: store.id } }),
      prisma.product.findMany({ where: { storeId: store.id } }),
    ]);

    // Récupérer les ratings pour les produits du store
    const ratings =
      products.length > 0
        ? await prisma.rating.findMany({
            where: { productId: { in: products.map((p) => p.id) } },
            include: { user: true, product: true },
          })
        : [];

    const totalEarnings = orders.reduce((acc, order) => acc + order.total, 0);

    const dashboardData = {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalEarnings,
      ratings,
    };

    return NextResponse.json({ dashboardData });
  } catch (error) {
    console.error("[DASHBOARD_GET]", error);
    return NextResponse.json({
      dashboardData: {
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        ratings: [],
      },
      error: error.message,
    });
  }
}
