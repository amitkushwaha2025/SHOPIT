const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponCode:{
        type:String,
        required:[true,'please enter your coupon code'],
        maxLength:[5,'your COUPON CODE can not exceed 5 characters']
    },
    percentage:{
        type:Number,
        required:[true,'please enter your percentage'],
        min:[5,'minimum coupon discount 5%'],
        max:[95,'maximum coupon discount 95%']
    }, 
})

module.exports = mongoose.model('Coupons',couponSchema)