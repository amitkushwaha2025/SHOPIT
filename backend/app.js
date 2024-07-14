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
const {fileURLTopath} = require('url')




if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').config({ path: 'backend/config/config.env' });
}



app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(fileUploaded());


app.use("/api/v1", product);
app.use('/api/v1', auth);
app.use('/api/v1', order)
app.use('/api/v1', payment)
app.use('/api/v1', coupon)

// Resolving dirname for ES module
// const __filename = fileURLTopath(import.meta.url)
// const __dirname = path.dirname(__filename)


if (process.env.NODE_ENV === "PRODUCTION") {
    app.use(express.static(path.join(__dirname, 'frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
}
// middleware to handle errors
app.use(errorMiddleware);


module.exports = app;