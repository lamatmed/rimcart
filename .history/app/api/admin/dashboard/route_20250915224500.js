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

    // Compter
    const [totalProducts, totalStores, totalOrders] = await Promise.all([
      prisma.product.count(),
      prisma.store.count(),
      prisma.order.count(),
    ]);

    // Revenu total
    const revenueAgg = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: "completed" },
    });

    // Tous les orders
    const allOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true, store: true },
    });

    return NextResponse.json({
      dashboardData: {
        products: totalProducts,
        revenue: revenueAgg._sum.totalAmount || 0,
        orders: totalOrders,
        stores: totalStores,
        allOrders,
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
