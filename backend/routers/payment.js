 const express = require('express');
 const router = express.Router();

 const {processPayment, sendStripeApi} = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middleware/auth');

 router.post("/payment/process",isAuthenticatedUser,processPayment) 
 router.get("/stripeapi",isAuthenticatedUser,sendStripeApi) 

 module.exports = router;