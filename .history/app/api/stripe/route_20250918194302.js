import { buffer } from "micro";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Stripe nécessite le body brut
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 🎯 Gérer les événements Stripe
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;

        // Récupérer les infos de commande depuis metadata
        const orderIds = session.metadata.orderIds.split(",");

        // Marquer les commandes comme payées
        await prisma.order.updateMany({
          where: { id: { in: orderIds } },
          data: { paymentStatus: "PAID", paymentIntentId: session.payment_intent },
        });

        console.log(`Orders ${orderIds} marked as paid`);
        break;

      case "payment_intent.payment_failed":
        const failedIntent = event.data.object;
        console.log(`Payment failed for: ${failedIntent.id}`);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
