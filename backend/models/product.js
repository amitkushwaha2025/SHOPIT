const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter product name"],
        trim:true,
        maxLength:[100,"product name cannot exceed 100 characters"]
    },
    price:{
        type:Number,
        requried:[true,"please enter product price"],
        maxLength:[5,"product name cannot exceed 5 characters"],
        default:0.0,
    },
    description:{
        type:String,
        required:[true,"please enter product description"],
    
    },
    ratings:{
        type:Number,
        default:0,
    },
    images:[
        {
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true
            },
        }
    ],
    category:{
        type:String,
        requried:[true,"please select category for this product"],
        enum:{
            values:[
                'Electronics',
                'Cameras',
                'Laptop',
                'Accessories',
                'headphones',
                'Food',
                "Books",
                'Clothes/Shoes',
                "Beauty/Health",
                'Sports',
                'Outdoor',
                'Home'
            ],
            message:"Please select correct category for product"
        }
    },
    seller:{
        type:String,
        required:[true , "please enter product seller"]
    },
    stock:{
        type:Number,
        required:[true,"please enter product stock"],
        min:[0,"stock not contain nagative value"],
        maxLength:[5,"product name can't exceed 5 characters"],
        default:0,
    },
    numOfReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true,
            },
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true,
            },
            comment:{
                type:String,
                required:true,
            },
        }
    ],
    
    createdAt:{
        type:Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Product',productSchema);