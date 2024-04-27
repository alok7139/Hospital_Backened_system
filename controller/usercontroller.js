import {catchasyncerror} from '../middleware/catchasyncerror.js'
import ErrorHandler from '../middleware/errormiddleware.js'
import { User } from '../models/userSchema.js';
import {generateToken }  from '../utils/jwttoken.js'
import cloudinary from 'cloudinary'

export const patientregister = catchasyncerror(async(req,res,next) => {
    const {firstname,lastname,email,phone,password,gender,dob,role} = req.body;

    if(!firstname || !lastname || !email || !phone || !password || !gender || !dob || !role){
        return next(new ErrorHandler("please fill full form" , 400));
    }
    let user =  await User.findOne({email});
    if(user){
        return next(new ErrorHandler("User already registered" , 400));
    }
    user = await User.create({
        firstname,lastname,email,phone,password,gender,dob,role : "Patient",
    });

    generateToken(user,"user registered" , 200,res);
    // res.status(200).json({
    //     success:true,
    //     message: "user registered",
    // });

})


export const login = catchasyncerror(async(req,res,next) => {
    const { email,password ,confirmpassword,role} = req.body;
    if( !email || !password || !confirmpassword || !role){
        return next(new ErrorHandler("please provide all details!" , 400));
    }
    if(password !== confirmpassword){
        return next(new ErrorHandler("Invalid Password!" , 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid User!" , 400)); 
    }
    const comppassword = await user.comparepassword(password);
    if(!comppassword){
        return next(new ErrorHandler("Invalid Password!" , 400)); 
    }
    if(role !== user.role){
        return next(new ErrorHandler("User with this role not found!" , 400)); 
    }

    generateToken(user,"user loggedin successfully" , 200,res);
    // res.status(200).json({
    //     success:true,
    //     message: "user loggedin successfully!",
    // });
})

export const addadmin = catchasyncerror(async(req,res,next) => {
    const {firstname,lastname,email,phone,password,gender,dob} = req.body;
    if(!firstname || !lastname || !email || !phone || !password || !gender || !dob){
        return next(new ErrorHandler("please fill full form" , 400));
    }
    const isregistered = await User.findOne({email});
    if(isregistered){
        return next(new ErrorHandler(`${isregistered.role} with this email already exists`))
    }
    const admin = await User.create({firstname,lastname,email,phone,password,gender,dob,role: "Admin",})
    res.status(200).json({
        success:true,
        message: " new Admin registered",
        admin,
    })
})

export const getalldoctors = catchasyncerror(async(req,res,next) => {
    const doctors = await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctors,
    })

})


export const getuserdetails = catchasyncerror(async(req,res,next) => {
    const user = req.user;
    res.status(200).json({
        success:true,
        user,
    })

})

export const logoutadmin = catchasyncerror(async(req,res,next) => {
    res.status(200).cookie('admintoken' , "" , {
        httpOnly:true,
        expires: new Date(Date.now()),
        secure:true,
        sameSite:"None"
    }).json({
        success:true,
        message: "admin logged out successfully",
    });    
})

export const logoutpatient = catchasyncerror(async(req,res,next) => {
    res.status(200).cookie('patienttoken' , "" , {
        httpOnly:true,
        expires: new Date(Date.now()),
        secure:true,
        sameSite:"None"
    }).json({
        success:true,
        message: "patient logged out successfully",
    });    
})

export const addnewdoctor = catchasyncerror(async(req,res,next) => {
    if(!req.files || Object.keys(req.files).length ===0 ){
        return next(new ErrorHandler("Doctor avatar required" , 400));
    }
    
    const {docAvatar} = req.files;
    const allowedFormats = ["image/png" , "image/jpeg"  , "image/webp"];
    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("file format not supported" , 400));
    }
    const {firstname,lastname,email,phone,password,gender,dob, doctorDepartment} = req.body;
    if(!firstname || !lastname || !email || !phone || !password || !gender || !dob || !doctorDepartment){
        return next(new ErrorHandler("please provide full details!" , 400));
    }
    const isregistered = await User.findOne({email});
    if(isregistered){
        return next(new ErrorHandler(`${isregistered.role} already registered`))
    }
    const cloudinaryresponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
    if(!cloudinaryresponse || cloudinaryresponse.error){
        console.error("cloudinary error" , cloudinaryresponse.error || "unknown cloudinary error");
        return next(new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500) );
    }
    const doctor = await User.create({
        firstname,lastname,email,phone,password,gender,dob,role:"Doctor" , doctorDepartment,docAvatar:{public_id:cloudinaryresponse.public_id , 
        url:cloudinaryresponse.secure_url,}
    })
    res.status(200).json({
        success:true,
        message:"new doctor registered",
        doctor,
    })
})