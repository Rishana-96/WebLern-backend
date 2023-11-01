import Express from "express";
const adminRoute = Express();
import {
  adminLogin,
  userList,
  tutorNotApproved,
  blockUser,
  unblockUser,
  approveTutor,
  rejectTutor,
  blockTutor,
  unblockTutor,
} from "../controller/adminController.js";
import { adminAuth } from "../middleware/Auth.js";
//import { express } from "cookies";

adminRoute.post("/login", adminLogin);
adminRoute.get("/userList", adminAuth, userList);
adminRoute.get("/tutorList", adminAuth, tutorNotApproved);
adminRoute.patch("/blockUser", adminAuth, blockUser);
adminRoute.patch("/unblockUser", adminAuth, unblockUser);
adminRoute.put("/approve-tutor", adminAuth, approveTutor);
adminRoute.put("/reject-tutor", adminAuth, rejectTutor);
adminRoute.patch("/blockTutor", adminAuth, blockTutor);
adminRoute.patch("/unblockTutor", adminAuth, unblockTutor);

export default adminRoute;
