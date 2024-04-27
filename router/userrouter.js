import express from 'express'
import { login, patientregister , addadmin, getalldoctors, getuserdetails, logoutadmin, logoutpatient, addnewdoctor } from '../controller/usercontroller.js';
import {isadminauthenticated,ispatientuthenticated} from '../middleware/auth.js' 
const router = express.Router();


router.post("/patient/register" , patientregister);
router.post("/login" , login);
router.post("/admin/addnew"  , isadminauthenticated, addadmin );
router.get("/doctors"  , getalldoctors );
router.get("/admin/me" , isadminauthenticated , getuserdetails)
router.get("/patient/me" , ispatientuthenticated , getuserdetails)
router.get("/admin/logout" , isadminauthenticated , logoutadmin)
router.get("/patient/logout" , ispatientuthenticated , logoutpatient)
router.post("/doctor/addnew" , isadminauthenticated, addnewdoctor)



export default router;