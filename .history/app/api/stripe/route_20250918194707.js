
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



export default async function POST(req) {
  try {
    const body = await req.text()
    const sig = req.get
  } catch (error) {
    
  }

}
