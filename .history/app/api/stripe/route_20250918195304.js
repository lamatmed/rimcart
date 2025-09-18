import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function POST(req) {
  try {
    const body = await req.text();
    const sig = req.get("stripe-signature");
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    // Gérer les événements Stripe
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const orderIds = session.metadata.orderIds.split(",");

        // Marquer les commandes comme payées
        await prisma.order.updateMany({
          where: { id: { in: orderIds } },
          data: {
            paymentStatus: "PAID",
            paymentIntentId: session.payment_intent,
          },
        });

        console.log(`Orders ${orderIds} marked as paid`);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {}
}
