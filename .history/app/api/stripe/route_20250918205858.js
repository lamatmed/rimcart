import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function POST(req) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    const handlePaymentIntent = async (paymentIntentId, isPaid) => {
      // On récupère le PaymentIntent directement
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      // Metadata stockée dans le PaymentIntent
      const { orderIds, userId, appId } = paymentIntent.metadata;

      if (appId !== "RimCart") {
        console.log("Invalid app id:", appId);
        return;
      }

      const orderIdsArray = orderIds.split(",");

      if (isPaid) {
        // Marquer les commandes comme payées
        await Promise.all(
          orderIdsArray.map(async (orderId) => {
            await prisma.order.update({
              where: { id: orderId },
              data: { isPaid: true },
            });
          })
        );

        // Vider le panier de l'utilisateur
        await prisma.user.update({
          where: { id: userId },
          data: { cart: {} },
        });
      } else {
        // Supprimer les commandes si paiement annulé
        await Promise.all(
          orderIdsArray.map(async (orderId) => {
            await prisma.order.delete({
              where: { id: orderId },
            });
          })
        );
      }
    };

    // Gérer les événements Stripe
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntent(event.data.object.id, true);
        break;

      case "payment_intent.canceled":
        await handlePaymentIntent(event.data.object.id, false);
        break;

      default:
        console.log(`Unhandled  event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export const config ={
    api:{bodyparser:false}
}