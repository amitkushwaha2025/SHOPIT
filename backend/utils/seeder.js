const Product = require("../models/product");
const dotenv = require('dotenv');
const connectDatabase = require("../config/database")


const product = require("../data/products");

//setting dotenv file

dotenv.config ({path: "backend/config/config.env"});

connectDatabase();

const seedProducts = async()=>{
    try{
        await Product.deleteMany();

        await Product.insertMany(product)

        process.exit();

    }catch(error){
        console.error(error)
        process.exit();

    }
}

seedProducts();