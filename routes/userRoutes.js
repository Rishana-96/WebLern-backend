import express from 'express';
const userRoute = express();
import { Verification, userRegister,userLogin } from '../controller/userController.js';

userRoute.post('/register',userRegister)
userRoute.post('/verifyUser',Verification)
userRoute.post('/login',userLogin)




export default userRoute