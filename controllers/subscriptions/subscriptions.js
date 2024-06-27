
const stripe = require('stripe')("sk_test_51OwuO4LcfLzcwwOYsXYljgE1gUyGnLFvjewSf1NG9CsrSqTsxm7n7ppmZ2ZIFL01ptVDhuW7LixPggik41wWmOyE00RjWnYxUA");
const bodyParser = require('body-parser');
const subscriptionModel=require('../../models/subscription/subscription')
module.exports.createSession=async(req,res)=>{
   let {title,price,subscriptionType}=req.body;
   console.log(price)
    try{
        const customer = await stripe.customers.create({
            name: req.user.name,
            email: req.user.email,
            phone:req.user.phoneNumber
          });
        const session = await stripe.checkout.sessions.create({
            success_url: 'https://basketballfrontend.vercel.app/',
           customer:customer.id,
            line_items: [
              {
                quantity:1,
                price_data:{
                    currency:'usd',
                    product_data:{
                    name:'UR subscription',
                    description:title,
                    },
                    unit_amount: price*100,
                    recurring:{
                        interval:subscriptionType
                    }
                }
              },
            ],
            mode:'subscription',
          });
          res.status(200).json({
            session
          })
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
            error:"Server error please try again"
        })
    }
}



module.exports.webhooks=async(req,res)=>{
  console.log("Received Stripe webhook");
  
  let endpointSecret="whsec_b82d718fbae44ab38035f9ce59915a1c5c7870d001c5d90f38cab27b8e52a15c"
  let event;
  const sig = req.headers['stripe-signature'];
  const rawBody = req.rawBody; 

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.log('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout Session completed:', session);
      const subscriptionData = {
        email: session.customer_details.email,
        name: session.customer_details.name,
        expires_at: new Date(session.expires_at * 1000), 
        amount: session.amount_total / 100, 
        subtype: session.mode === 'subscription' ? 'monthly' : 'one-time', 
      };

      try {
       
        const subscription = await subscriptionModel.create(subscriptionData);
        console.log('Subscription stored:', subscription);
      } catch (error) {
        console.error('Error storing subscription:', error.message);
        return res.status(500).send('Internal server error');
      }


      break;
    case 'checkout.session.failed':
      const failedSession = event.data.object;
      console.log('Checkout Session failed:', failedSession);
      
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

 
  res.json({ received: true });

}