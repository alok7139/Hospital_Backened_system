import { User } from "../models/userSchema.js";
import { catchasyncerror } from "./catchasyncerror.js";
import ErrorHandler from "./errormiddleware.js";
import jwt from 'jsonwebtoken'

export const isadminauthenticated = catchasyncerror(async(req,res,next)=>{
    const token = req.cookies.admintoken;
    if(!token){
        return next(new ErrorHandler("Admin not authenticated" , 400));
    }
    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if(req.user.role !== "Admin"){
        return next(new ErrorHandler(`${req.user.role} not authorized ` , 403));
    }
    next();
})

export const ispatientuthenticated = catchasyncerror(async(req,res,next)=>{
    const token = req.cookies.patienttoken;
    if(!token){
        return next(new ErrorHandler("Patient not authenticated" , 400));
    }
    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if(req.user.role !== "Patient"){
        return next(new ErrorHandler(`${req.user.role} not authorized ` , 403));
    }
    next();
})