import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
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
   // Fonction pour gérer le PaymentIntent
    const handlePaymentIntent = async (paymentIntentId, isPaid) => {
      const session = await stripe.checkout.list(paymentIntentId);

      const orderIds = paymentIntent.metadata.orderIds
        ? paymentIntent.metadata.orderIds.split(",")
        : [];

      if (orderIds.length > 0) {
        await prisma.order.updateMany({
          where: { id: { in: orderIds } },
          data: {
            paymentStatus: isPaid ? "PAID" : "CANCELED",
            paymentIntentId: paymentIntent.id,
          },
        });
        console.log(`Orders ${orderIds.join(",")} updated with status ${isPaid ? "PAID" : "CANCELED"}.`);
      }
    };
    // Gérer les événements Stripe
    switch (event.type) {
      case "payment_intent.succeeded":{
         await handlePaymentIntent(event.data.object.id,true)
          break;
      }
        
       
 case "payment_intent.canceled":{
         await handlePaymentIntent(event.data.object.id,false)
          break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
       break;
    }

  return NextResponse.json({received:true})
  } catch (error) {
    return NextResponse.json({error:error.message},{status:400})
  }
}
