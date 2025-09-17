import prisma from "@/lib/prisma";
import { authSeller } from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    const store = await authSeller(userId);

    if (!store) {
      // Si pas de store, renvoyer des données par défaut
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
    const orders = await prisma.order.findMany({
      where: { storeId: store.id },
    });

    const products = await prisma.product.findMany({
      where: { storeId: store.id },
    });

    const ratings = await prisma.rating.findMany({
      where: { productId: { in: products.map((p) => p.id) } },
      include: { user: true, product: true },
    });

    const dashboardData = {
      ratings,
      totalOrders: orders.length,
      totalEarnings: orders.reduce((acc, order) => acc + order.total, 0),
      totalProducts: products.length,
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
