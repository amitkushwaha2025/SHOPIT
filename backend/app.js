const express = require("express");
const app = express();

const errorMiddleware = require("./middleware/error")


// import route files
const product = require("./routers/product");
const auth = require("./routers/auth");
const payment = require('./routers/payment')
const coupon = require('./routers/coupon')
const cookieParser = require("cookie-parser");
const order = require("./routers/order");
const bodyParser = require("body-parser");
const fileUploaded = require('express-fileupload')
const path = require("path")


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(fileUploaded());


app.use("/api/v1", product);
app.use('/api/v1', auth);
app.use('/api/v1', order)
app.use('/api/v1', payment)
app.use('/api/v1', coupon)

// middleware to handle errors
app.use(errorMiddleware);


module.exports = app;