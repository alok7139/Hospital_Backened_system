import express from 'express'
import { deleteappointment, getallappointment, postappointment, updateappointmentstatus } from '../controller/appointmentcontoller.js';
import { isadminauthenticated, ispatientuthenticated } from '../middleware/auth.js';


const router = express.Router();


router.post('/post' ,ispatientuthenticated , postappointment)
router.get('/getall' ,isadminauthenticated, getallappointment)

//update ke liye put ka istemal karte hai
router.put('/update/:id' ,isadminauthenticated, updateappointmentstatus)
router.delete('/delete/:id' ,isadminauthenticated, deleteappointment)


export default router;
