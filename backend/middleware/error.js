const ErrorHandler = require("../utils/errorHandler");

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode ||500;
    err.message = err.message || "Internal Server Error";

    if(process.env.NODE_ENV == "DEVELOPMENT"){
        
        res.status(err.statusCode).json({
            success:false,
            error:err,
            errMessage :err.message,
            stack:err.stack
        })
    }

    if(process.env.NODE_ENV == "PRODUCTION"){
        let error = {...err}

        error.message = err.message;

        //handling mongoose validation error
        if(err.name === 'CastError'){
            const message = `Resource not found invalid: ${err.paht}`
            error = new ErrorHandler(message,400); 
        }

        //Handling Mongoose validaton Error
        if(err.name ===`ValidationError`){
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message , 400)
        }
        
        //handling mongoose duplicate key errors
        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message,400)
        }

        //Handling Mongoose validaton Error
        if(err.name ===`jsonwebTokenError`){
            const message = `JSON web Token is invalid. Try Again`;
            error = new ErrorHandler(message , 400)
        }

        //Handling Mongoose validaton Error
        if(err.name ===`TokenExpiredError`){
            const message = `JSON web token is expired . try again!!!`;
            error = new ErrorHandler(message , 400)
        }

        res.status(err.statusCode).json({
            success:false,
            message:err.message || "Internal server error",
        })
    }
    
}