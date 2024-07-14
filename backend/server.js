const express = require('express')
const app = require("./app");
const path = require('path')

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



// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all handler for all other requests and serve the frontend's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});




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

