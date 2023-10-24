import  Express  from "express";
const adminRoute = Express()
import { adminLogin,userList,tutorNotApproved, blockUser,unblockUser, approveTutor,rejectTutor } from "../controller/adminController.js";
//import { express } from "cookies";

adminRoute.post('/login',adminLogin)
adminRoute.get('/userList',userList)
adminRoute.get('/tutorList',tutorNotApproved)
adminRoute.patch('/blockUser',blockUser)
adminRoute.patch('/unblockUser',unblockUser)
adminRoute.put('/approve-tutor',approveTutor)
adminRoute.put('/reject-tutor',rejectTutor)

export default adminRoute