import express from 'express'
import { getallmessage, sendmessage } from '../controller/messagecontrol.js';
import { isadminauthenticated } from '../middleware/auth.js';

const router = express.Router();



router.post('/send' , sendmessage)
router.get('/getall' , isadminauthenticated ,getallmessage)


export default router;