import { Appointment } from "../models/appointmentSchema.js";
import { catchasyncerror } from "../middleware/catchasyncerror.js";
import ErrorHandler from "../middleware/errormiddleware.js"; 
import { User } from "../models/userSchema.js";

export const postappointment = catchasyncerror(async(req,res,next) => {
    const  {

        firstname,
        lastname,
        email,
        phone,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstname,
        doctor_lastname,
        hasvisited,
        address,
    } = req.body;

    if (
        !firstname ||
        !lastname ||
        !email ||
        !phone ||
        !dob ||
        !gender ||
        !appointment_date ||
        !department ||
        !doctor_firstname ||
        !doctor_lastname ||
        !address
      ){
    return next(new ErrorHandler("please fill full form" , 400));
    
    }
    

    const isconflict = await User.find({firstname: doctor_firstname , lastname:doctor_lastname, role:"Doctor" , doctorDepartment:department,})

    if(isconflict.length === 0){
        return next(new ErrorHandler("doctor Not found!" ,400));

    }
    if(isconflict.length > 1){
        return next(new ErrorHandler("At this time this doctor is not available ,please Contact if you want that particular doctor via email or phone" ,400));

    }

    const doctorId = isconflict[0]._id;
    const patientId = req.user._id;
    const appointment = await Appointment.create({
        firstname,
        lastname,
        email,
        phone,
        dob,
        gender,
        appointment_date,
        department,
        doctor:{
            firstname:doctor_firstname,
            lastname: doctor_lastname,
        },
        hasvisited,
        address,
        doctorId,
        patientId  ,
    })

    res.status(200).json({
        success:true,
        message: " Appointment is successfully registered",
        appointment,
    });
})

export const getallappointment = catchasyncerror(async(req,res,next) => {
    const appointment = await Appointment.find();
    res.status(200).json({
        status:true,
        appointment,
    })
})

export const updateappointmentstatus = catchasyncerror(async(req,res,next) => {
    const {id} = req.params;
    let appointment = await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler(`Appointment not found` , 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        success:true,
        message:"Appointment status updated",
        appointment,
    })
})

export const deleteappointment = catchasyncerror(async(req,res,next) =>{
    const {id} = req.params;
    let appointment = await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler(`Appointment not found` , 404));
    }
    await appointment.deleteOne();
    res.status(200).json({
        success:true,
        message:"Appointment deleted",
        // appointment,
    })
})
