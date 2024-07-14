const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config({path: "backend/config/config.env"})

const connectDatabase = ()=>{
    mongoose.connect(process.env.MONGOOSE_URL)
    .then(con=>{
        console.log(`Mongo Database connection with HOST: ${con.connection.host}`)
    })
}

module.exports = connectDatabase;