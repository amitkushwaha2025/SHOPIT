const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken');
const crypto = require("crypto");

require("dotenv").config({path: 'backend/config/config.env'});

const userSchema = new mongoose.Schema ({
    name:{
        type:String,
        require:[true,'please enter your name'],
        maxLength:[30,'your name can not exceed 30 characters']
    },
    email:{
        type:String,
        require:[true,'please enter your email'],
        unique:true,
        validate:[validator.isEmail, 'please enter valid email address']
    }, 
    password:{
        type:String,
        require:[true,'please enter your password'],
        minLength:[6, 'Your password must be longer then 6 characters'],
        select:false,
    },
    avatar :{
        public_id :{
            type:String,
            require:true,
        },
        url:{
            type:String,
            required:true,
        }
    },
    role:{
        type:String,
        required:true,
        default:'user',
    }, 
    createdAt :{
        type:Date,
        default:Date.now,
    },
    resetPasswordToken :String,
    resetPasswordExpire :Date,
})



// encrypting password before saving user
userSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password,salt)
})

//compare user password 
userSchema.methods.comparePassword = async function(enterpassword){
    return await bcrypt.compare(enterpassword,this.password)
}

// JWT token are creating

userSchema.methods.createJWT = function (){
    return JWT.sign({id : this._id},process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE_TIME
    })
}


// Generate password reset token 
userSchema.methods.getResetPasswordToken = function(){
    // Generate token 
    const resetToken = crypto.randomBytes(32).toString("hex");

    //Hash and set to resetPasswordToken 
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // set token expire time 
    this.resetPasswordExpire = Date.now() + 3 * 7 * 60 * 60 * 1000

    return resetToken
}

module.exports = mongoose.model('User',userSchema)