import mongoose from 'mongoose'
import validator from 'validator'

const appointmentSchema = new mongoose.Schema({
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
    appointment_date:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true,
    },
    doctor:{
        firstname:{
            type:String,
            required:true,
        },
        lastname:{
            type:String,
            required:true,
        },

    },
    hasvisited:{
        type:Boolean,
        default:false,
    },
    doctorId:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },
    patientId:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["Pending", "Accepted" , "Rejected"],
        default:"Pending",
    },

})

export const Appointment = mongoose.model("Appointment" , appointmentSchema);

