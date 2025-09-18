import prisma from "@/lib/prisma";
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
    const handlePaymentIntent = async(paymentItentId,isPaid)=>{

    }
    // Gérer les événements Stripe
    switch (event.type) {
      case "payment_intent.succeeded":{
         await handlePaymentIntent(event.data.object.id,true)
         
      }
        
       

      default:
      
    }

  
  } catch (error) {}
}
