import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        minLength: [3, "firstname must contain at least 3 characters!"],
    },
    lastname:{
        type:String,
        required:true,
        minLength: [3, "lastname must contain at least 3 characters!"],
    },
    email:{
        type:String,
        required:true,
        validate: [validator.isEmail, "please provide a valid email"],
    },
    phone:{
        type:String,
        required:true,
        minLength: [10, "Phone number must contain 10 digit"],
        maxLength: [10, "Phone number must not be greater then 10 digit"],
    },
    dob:{
        type:Date,
        required:[true, "DOB is required"],
    },
    gender:{
        type:String,
        required:true,
        enum : ["Male" , "Female" , "Others"],
    },
    password:{
        type:String,
        minLength: [6,"password must conatin at least 8 characters!"],
        required:true,
        select:false,
    },
    role:{
        type:String,
        required:true,
        enum: ["Admin" , "Patient" , "Doctor"],
    },
    doctorDepartment:{
        type:String
    },
    docAvatar:{
        public_id:String,
        url:String,
    },
})
userSchema.pre("save" , async function(next){
    if(!this.isModified("password")){
        next() 
    }
    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.comparepassword = async function(enterpassword){
    return await bcrypt.compare(enterpassword,this.password);
};

userSchema.methods.generateJsonwebToken = function(){
    return jwt.sign({id : this._id} , process.env.JWT_SECRET_KEY, {
           expiresIn: process.env.JWT_EXPIRES,
    })
}

export const User = mongoose.model("User" , userSchema)