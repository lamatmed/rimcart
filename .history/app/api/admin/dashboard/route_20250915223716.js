import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    // Vérification admin
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // Compter les stores par status
    const [
      approvedCount,
      pendingCount,
      rejectedCount,
      activeCount,
      inactiveCount,
      totalProducts,
      totalUsers,
      totalStores,
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
    ] = await Promise.all([
      prisma.store.count({ where: { status: "approved" } }),
      prisma.store.count({ where: { status: "pending" } }),
      prisma.store.count({ where: { status: "rejected" } }),
      prisma.store.count({ where: { isActive: true } }),
      prisma.store.count({ where: { isActive: false } }),
      prisma.product.count(),
      prisma.user.count(),
      prisma.store.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count({ where: { status: "completed" } }),
      prisma.order.count({ where: { status: "cancelled" } }),
    ]);

    // Calcul revenu total
    const revenueAgg = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: "completed" },
    });

    // Récupérer les commandes récentes pour le graphique
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        totalAmount: true,
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      dashboardData: {
        products: totalProducts,
        revenue: revenueAgg._sum.totalAmount || 0,
        orders: totalOrders,
        stores: totalStores,
        allOrders: allOrders,
      },
    });
  } catch (error) {
    console.error("[ADMIN_DASHBOARD_GET]", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}