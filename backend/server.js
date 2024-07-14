const app = require("./app");

// const dotenv = require("dotenv");
const cloudinary = require('cloudinary').v2;


const connectDatabase = require("./config/database")

process.on('uncaughtException',err=>{
    console.log(`ERROR : ${err.message}`);
    console.log(`STACK ERROR : ${err.stack}`);
    console.log(`Shutting down due to uncaught error`);
    process.exit(1);
})

//setting up cloudinry  configration 
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})


// setting up config file
if(process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').config({path: 'backend/config/config.env'});
}


//connection database 
connectDatabase()




const server = app.listen( process.env.PORT, ()=>{
    console.log(`Server started on PORT:${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

// Handle udhandled promise rejections
process.on('unhandledRejection',err =>{
    console.log(`ERROR: ${err.message}`);
    console.log("shutting down the server due to unhandled Promise rejection");
    server.close(()=>{
        process.exit(1)
    })
})

