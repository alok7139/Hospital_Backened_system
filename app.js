import express from 'express';
import { config } from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { dbconnection } from './database/dbconnection.js';
import messagerouter from './router/messagerouter.js';
import {errormiddleware} from './middleware/errormiddleware.js'
import userrouter from './router/userrouter.js'
import appointmentrouter from './router/appointmentrouter.js'


const app = express();
config({path:'./.env'})

app.use(cors({
    origin:[process.env.FRONTEND_URL , process.env.DASHBOARD_URL],
    methods:["GET" , "POST" , "DELETE" , "PUT"],
    credentials:true,
}));



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
}));


app.use('/api/v1/message' , messagerouter);
app.use('/api/v1/user' , userrouter);
app.use('/api/v1/appointment' , appointmentrouter);

dbconnection();


app.use(errormiddleware);
export default app;