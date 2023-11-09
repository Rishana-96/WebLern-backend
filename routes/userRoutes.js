import express from "express";
const userRoute = express();
import {
  Verification,
  userRegister,
  userLogin,
  userDetails,
  userSave,
} from "../controller/userController.js";
import { userAuth } from "../middleware/Auth.js";

userRoute.post("/register", userRegister);
userRoute.post("/verifyUser", Verification);
userRoute.post("/login", userLogin);
userRoute.get("/userDetails", userDetails);
userRoute.post("/userSave", userAuth, userSave);
export default userRoute;
