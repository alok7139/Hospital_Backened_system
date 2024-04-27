import mongoose from 'mongoose'
import validator from 'validator'


const messageSchema = new mongoose.Schema({
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
        maxLength: [10, "Phone number must contain 10 digit"],
    },
    message:{
        type:String,
        required:true,
        minLength: [10, "message must contain at least 100 words"],
    },
    
})

export const Message = mongoose.model("message" , messageSchema);