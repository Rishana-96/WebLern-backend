import express from "express";
import multer from "multer";
import path from "path";
import {
  tutorRegister,
  tutorLogin,
  Verification,
  tutorNotApprouved,
  tutorDetails,
  tutorSave,
} from "../controller/tutorController.js";
import { fileURLToPath } from "url";

const tutorRoute = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../Files"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 20, // 20 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

tutorRoute.post("/register", upload.single("cv"), tutorRegister);
tutorRoute.post("/verifyTutor", Verification);
tutorRoute.post("/tutor-login", tutorLogin);
tutorRoute.get("/tutorList", tutorNotApprouved);
tutorRoute.get("/tutorDetails", tutorDetails);
tutorRoute.post("/tutorSave", tutorSave);
export default tutorRoute;
