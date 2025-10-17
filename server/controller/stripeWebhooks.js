import stripe  from 'stripe';
import { Booking } from '../model/booking.model.js';
export const stripeWebHook=async(req,res)=>{
    try {
        const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY)
        const sig=req.headers['stripe-signature']
        let event
        try {
            event=stripeInstance.webhooks.constructEvent(req.rawBody,sig,process.env.STRIPE_WEBHOOK_SECRET)
        } catch (error) {
            console.log("❌ Webhook signature verification failed.",error.message);
            return res.status(400).send(`Webhook Error:${error.message}`)
        }

        // Handle the event
        if(event.type==='payment_intent.succeeded'){
            const paymentIntent=event.data.object
            const paymentIntentId=paymentIntent.id
            // getting metadata session
            const session=await stripeInstance.checkout.sessions.session.list({
                payment_intent:paymentIntentId
            })

            const{ bookingId}=session.data[0].metadata
            // mark payment as paid
            await Booking.findByIdAndUpdate(bookingId,{isPaid:true,paymentMethod:'Stripe'})
            
        }else{
            console.log(`Unhandled event type ${event.type}`);
        }
        res.status(200).json({received:true})

    } catch (error) {
        console.log("❌ Stripe Webhook Error:",error);
        res.status(500).json({success:false,message:"Server error in stripe webhook"})
    }


}
