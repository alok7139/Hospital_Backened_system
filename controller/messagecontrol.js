import { Message } from "../models/messageschema.js";
import {catchasyncerror} from '../middleware/catchasyncerror.js'
import ErrorHandler from '../middleware/errormiddleware.js'


export const sendmessage = catchasyncerror (async(req,res,next) => {
    const {firstname,lastname,email,phone,message} = req.body;
    if(!firstname || !lastname || !email || !phone || !message){
        return next(new ErrorHandler("please fill full form" , 400))
    }
        await Message.create({firstname,lastname,email,phone,message});
        res.status(200).json({
            success:true,
            message: "message send successfully",
        })
    
})


export const getallmessage = catchasyncerror(async(req,res,next) => {
    const message = await Message.find();
    res.status(200).json({
        success:true,
        message,
    })

})