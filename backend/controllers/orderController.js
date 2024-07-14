const Order = require("../models/order");
const Product = require('../models/product');

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// create a new order => /api/v1/order/new
exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const {
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        payment
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        payment,
        paidAt:Date.now(),
        user:req.user._id,
    })

    res.status(200).json({
        success:true,
        order
    })
})

//Get single orer => /api/v1/order:id
exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate('user','name email')

    if(!order){
        return next(new ErrorHandler("no order foun with this Id ",404))

    }
    res.status(200).json({
        success:true,
        order
    })
});

// get looged in user orders => api/v1/order/me

exports.myOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find({user:req.user.id})
    if(!orders){
        return next(new ErrorHandler("no any order in your account ",404))
    }
    
    res.status(200).json({
        success:true,
        orders
    })
})

// get all orders => api/v1/admin/orders/

exports.allOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find()
    if(!orders){
        return next(new ErrorHandler("no any order in your account ",404))
    }

    
    let totalAmount = 0;
    orders.forEach(orders=>{
        totalAmount += orders.totalPrice
    })
    
    res.status(200).json({
        success:true,
        totalOrders:orders.length,
        totalAmount,
        orders

    })
})

// upadate / process order - ADMIN => /api/v1/admin/order/:id

exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)

    if(order.orderStatus === "delivered"){
        return next(new ErrorHandler('you have already delivered this order', 400))
    }
    order.orderItems.forEach(async item =>{
        await updateStock(item.product, item.quantity)
    })
    order.orderStatus = req.body.status,
    order.deliverAt = Date.now();

    await order.save();

    res.status(200).json({
        success:true,
        order,
    })
})

async function updateStock(id,quantity){
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;
    await product.save({validateBeforeSave:false});
}

// delete order by admin => api/v1/admin/delete
exports.deleteOrder = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler(`your order is not found with this id: ${req.params.id}`,404))
    }

    await order.deleteOne()

    res.status(200).json({
        success:true,
        message:"order is successfull deleted"
    })
})