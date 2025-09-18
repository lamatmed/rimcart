import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaymentMethod } from "@prisma/client";
import Stripe from "stripe";

export async function POST(req) {
  try {
    const { userId, has } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }
    const { addressId, items, couponCode, paymentMethod } = await req.json();

    if (!addressId || !items?.length || !paymentMethod) {
      return NextResponse.json(
        { error: "Champs manquants ou invalides" },
        { status: 400 }
      );
    }
    let coupon = null;
    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });
      if (!coupon) {
        return NextResponse.json(
          { error: "Coupon not found" },
          { status: 400 }
        );
      }
    }

    if (couponCode && coupon.forNewUser) {
      const userorders = await prisma.order.findMany({ where: { userId } });
      if (userorders.length > 0) {
        return NextResponse.json(
          { error: "This coupon is only for new users" },
          { status: 403 }
        );
      }
    }
    const isPlusMember = has({ plan: "plus" });
    if (couponCode && coupon.forMember) {
      if (!isPlusMember) {
        return NextResponse.json(
          {
            error:
              "This coupon is only available for members (existing customers)",
          },
          { status: 403 }
        );
      }
    }
    const ordersByStore = new Map();
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });
      const storeId = product.storeId;
      if (!ordersByStore.has(storeId)) {
        ordersByStore.set(storeId, []);
      }
      ordersByStore.get(storeId).push({ ...item, price: product.price });
    }
    let orderIds = [];
    let fullAmount = 0;
    let isShippingFeeAdded = false;
    for (const [storeId, sellerItems] of ordersByStore.entries()) {
      let total = sellerItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      if (couponCode) {
        total -= (total * coupon.discount) / 100;
      }
      if (!isPlusMember && !isShippingFeeAdded) {
        total += 200;
        isShippingFeeAdded = true;
      }
      fullAmount += parseFloat(total.toFixed(2));
      const order = await prisma.order.create({
        data: {
          userId,
          storeId,
          addressId,
          total: parseFloat(total.toFixed(2)),
          paymentMethod,
          isCouponUsed: coupon ? true : false,
          coupon: coupon ? coupon : {},
          orderItems: {
            create: sellerItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
      orderIds.push(order.id);
    }

    if (paymentMethod === "STRIPE") {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const origin = req.headers.get("origin");

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [{
            price_data: {
            currency: "usd", // ⚡ change selon ta config ex: "eur"
            product_data: {
              name: 'Order', // il faut envoyer le nom du produit
            },
            unit_amount: Math.round(fullAmount* 100), // Stripe attend un montant en CENTIMES
          },
          quantity:1
        }],
        expires_at: Math.floor(Date.now /1000)+ 30 * 60,
        success_url: `${origin}/loading?nextUrl=orders`,
        cancel_url: `${origin}/cart`,
        metadata: {
          userId,
          orderIds: orderIds.join(','), // pour récupérer les commandes côté webhook Stripe
          appId: 'RimCart'
        },
      });

      return NextResponse.json({ session });
    }

    //clear cart
    await prisma.user.update({
      where: { id: userId },
      data: {
        cart: {},
      },
    });
    return NextResponse.json({ message: "Orders Placed Successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    console.log(userId);
    const orders = await prisma.order.findMany({
      where: {
        userId,
        OR: [
          { paymentMethod: PaymentMethod.COD },
          { AND: [{ paymentMethod: PaymentMethod.STRIPE }, { isPaid: true }] },
        ],
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
