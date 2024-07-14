const catchAsyncErrors = require("../middleware/catchAsyncErrors")


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//process stripe payments => /api/v1/payment.process



exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    const { amount } = req.body;

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        metadata: { integration_check: 'accept_a_payment' }
    });

    // Respond with client_secret if paymentIntent is successfully created
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    });
});


//send stripe api key  => /api/v1/stripeapi
exports.sendStripeApi = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })
})