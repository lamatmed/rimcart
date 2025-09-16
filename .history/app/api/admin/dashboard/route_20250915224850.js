import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [totalProducts, totalOrders, totalStores] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.store.count(),
    ]);

    // Somme des revenus uniquement pour les commandes livrées
    const revenueAgg = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: OrderStatus.DELIVERED },
    });

    const allOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        store: true,
        orderItems: { include: { product: true } },
      },
    });

    return NextResponse.json({
      dashboardData: {
        products: totalProducts,
        revenue: revenueAgg._sum.total || 0,
        orders: totalOrders,
        stores: totalStores,
        allOrders,
      },
    });
  } catch (error) {
    console.error("[ADMIN_DASHBOARD_GET] Error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
