

const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncErrors");
const APIFeatures = require("../utils/apiFrature");
const { findById } = require("../models/order");
const cloudinary = require("cloudinary").v2
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB


// Create new product   =>   /api/v1/admin/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    // Validate file sizes
    for (let image of images) {
        if (Buffer.byteLength(image, 'base64') > MAX_FILE_SIZE) {
            return next(new ErrorHandler("File size too large", 413));
        }
    }
    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})



// Get all products   =>   /api/v1/products?keyword=apple
exports.getProduct = catchAsyncError(async (req, res, next) => {
    const resPerPage = 8;
    const productsCount = await Product.countDocuments();

    // Applying search and filter features
    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
        .category();

    // Clone the query for filtering products count
    let products = await apiFeatures.query.clone();
    let filteredProductsCount = products.length;

    // Applying pagination to the cloned query
    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query.clone();

    // Sending the response with the product details
    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        filteredProductsCount,
        products,
    });
});

// Get all products (Admin)   =>   /api/v1/admin/products
exports.getAdminProduct = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })

})


// Get single product details   =>   /api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }


    res.status(200).json({
        success: true,
        product
    })

})



exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    let images = [];
    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images && images.length > 0) {
        // Validate file sizes
        for (let image of images) {
            if (Buffer.byteLength(image, 'base64') > MAX_FILE_SIZE) {
                return next(new ErrorHandler("File size too large", 413));
            }
        }

        // Delete existing images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.uploader.destroy(product.images[i].public_id);
        }

        // Upload new images
        let imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i], {
                folder: 'products'
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }
        req.body.images = imagesLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product,
    });
});

// delete products => api/v1/admin/produt/:id

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("product not found", 404))
    }

    // Deleting images associated with the product
    for(let i =0 ;i<product.length;i++){
        const result = await cloudinary.uploader.destroy(product.images[i].public_id)
    }



    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "product deleted has successfully complete"
    })
})


// create new review = /api/v1/review

exports.createProductReviwe = catchAsyncError(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length

    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.
        reviews.length


    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,

    })
})

// get product reviwes => api/v1/reviwes

exports.getProductReviwe = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        next(new ErrorHandler("product are not found for the this id for the reviwes", 400))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})


// delete product reviwe => api/v1/reviwes

exports.deleteReviwe = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString())

    const numOfReviews = reviews.length;
    const rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        rating,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })


    res.status(200).json({
        success: true,
        product
    })
})
