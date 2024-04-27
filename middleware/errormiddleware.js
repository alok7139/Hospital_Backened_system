class ErrorHandler extends Error{  // extends ka mtlb hota hai ki subclass Errorhandler parentclass Error ki sari property ko imherit karlega 
    constructor(message,statuscode){
        super(message);  // error ke sari property inherit kar lega
        this.statuscode = statuscode;
    }
}

export const errormiddleware = (err,req,res,next) => {
    err.message = err.message || "internal server error",
    err.statuscode = err.statuscode || 500;

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message , 400);
    }
    if(err.name === "JsonwebTokenError"){
        const message = "Json web Token is Invalid, Try again!";
        err = new ErrorHandler(message,400);
    }
    if(err.name === "JsonwebExpiredError"){
        const message = "Json web Token is Expired, Try again!";
        err = new ErrorHandler(message,400);
    }


    // if user is enterd number in the place of string like name ki jagah number dediya to
    if(err.name === "CastError"){
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    const errorMessage = err.errors
     ? Object.values(err.errors).map(error => error.message).join(" "):err.message;

    
   return res.status(err.statuscode).json({
    success:false,
    message:errorMessage,
   })
}

export default ErrorHandler;