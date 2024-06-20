
const stripe = require('stripe')("sk_test_51OwuO4LcfLzcwwOYsXYljgE1gUyGnLFvjewSf1NG9CsrSqTsxm7n7ppmZ2ZIFL01ptVDhuW7LixPggik41wWmOyE00RjWnYxUA");

module.exports.createSession=async(req,res)=>{
   
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
                    description:'Undiscovered recruiters subscription',
                    },
                    unit_amount: 3000,
                    recurring:{
                        interval:'month'
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