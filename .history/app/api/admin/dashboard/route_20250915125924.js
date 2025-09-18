import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ GET - Stats Dashboard Admin
export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    // Vérification admin
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // Compter les stores par status
    const [approvedCount, pendingCount, rejectedCount, activeCount, inactiveCount] =
      await Promise.all([
        prisma.store.count({ where: { status: "approved" } }),
        prisma.store.count({ where: { status: "pending" } }),
        prisma.store.count({ where: { status: "rejected" } }),
        prisma.store.count({ where: { isActive: true } }),
        prisma.store.count({ where: { isActive: false } }),
      ]);

    // Compter produits et utilisateurs
    const [totalProducts, totalUsers, totalStores] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.store.count(),
    ]);

    return NextResponse.json({
      stores: {
        total: totalStores,
        approved: approvedCount,
        pending: pendingCount,
        rejected: rejectedCount,
        active: activeCount,
        inactive: inactiveCount,
      },
      products: totalProducts,
      users: totalUsers,
    });
  } catch (error) {
    console.error("[ADMIN_DASHBOARD_GET]", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
