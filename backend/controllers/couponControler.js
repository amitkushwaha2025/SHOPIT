const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Coupons = require('../models/coupons');
const ErrorHandler = require("../utils/errorHandler");

exports.coupon = catchAsyncErrors(async(req,res,next)=>{

    const {couponCode, percentage} = req.body;

    const coupon = await Coupons.create({
        couponCode,
        percentage
    })

    res.status(200).json({
        success:true,
        coupon
    })
})
exports.couponDelete = catchAsyncErrors(async(req,res,next)=>{

    const coupon = await Coupons.findById(req.params.id)
    if(!coupon){
        next(new ErrorHandler(`coupon are not found`,404))
    }

    await coupon.deleteOne();
    
    res.status(200).json({
        success:true,
    })
})
exports.getAllCoupon = catchAsyncErrors(async(req,res,next)=>{

    const coupons = await Coupons.find()
    if(!coupons){
        return next(new ErrorHandler(`coupons are not exits`))
    }
    
    res.status(200).json({
        success:true,
        coupons
    })
})
