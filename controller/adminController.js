import userModel from "../model/userModel.js";
import tutorModel from "../model/tutorModel.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

//---------Admin Login-----------------//

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminData = await userModel.findOne({ email: email });
    if (!adminData) {
      res.status(400).json({
        message: "incorrect email",
      });
    }
    if (!(await bcrypt.compare(password, adminData.password))) {
      res.status(400).json({
        message: "password is incorrect",
      });
    }
    if (adminData.is_admin) {
      const token = Jwt.sign(
        { _id: adminData._id },
        process.env.ADMINSECRETKEY
      );
      res.json(token);
    } else {
      return res.status(400).json({
        message: "you are not admin",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//----------userlist fetching------//

export const userList = async (req, res) => {
  try {
    const userList = await userModel.find({ is_admin: false });

    res.status(200).json(userList);
  } catch (error) {
    console.log(error.message);
  }
};

//-----tutor list---------//

export const tutorNotApproved = async (req, res) => {
  try {
    const tutorData = await tutorModel.find();
    if (tutorData) {
      res.status(200).json(tutorData);
    } else {
      res.status(400).json({
        message: "something went wrong",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//-----------Block user---//

export const blockUser = async (req, res) => {
  try {
    const { id } = req.body;
    const updateUser = await userModel.updateOne(
      { _id: id },
      { $set: { is_blocked: true } }
    );
    if (updateUser) {
      res.json(updateUser);
    } else {
      res.status(400).json({
        message: "user blocking failed",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//-------------Unblock user--------------------//
export const unblockUser = async (req, res) => {
  try {
    const { id } = req.body;
    const updateUser = await userModel.updateOne(
      { _id: id },
      { $set: { is_blocked: false } }
    );
    if (updateUser) {
      res.json(updateUser);
    } else {
      res.json(400).json({
        message: "user unblocking failed",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//----------tutor approval----------/

export const approveTutor = async (req, res) => {
  try {
    const { id, status } = req.body;
    const tutorData = await tutorModel.findById(id);
    if (!tutorData) {
      return res.status(404).json({ message: "Tutor not found" });
    }
    if (tutorData.is_approve !== "waiting") {
      return res
        .status(400)
        .json({ message: "Tutor application has been processed" });
    }

    //update tutors approval status
    tutorData.is_approve = status;
    await tutorData.save();
    if (status === "approved") {
      const name = tutorData.name;
      const email = tutorData.email;
      const tutorId = tutorData._id;
      sendMail(name, email, tutorId);
    }
    res.status(200).json({
      message: `Tutor application ${
        status === "approved" ? "approved" : "rejected"
      }`,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal servor error" });
  }
};

//----------tutor reject----------/

export const rejectTutor = async (req, res) => {
  try {
    const { id, status } = req.body;
    const tutorData = await tutorModel.findById(id);
    if (!tutorData) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    const name = tutorData.name;
    const email = tutorData.email;
    sendMail(name, email, status);
    //update tutors approval status
    tutorData.is_approve = "rejected";
    await tutorData.save();
    res.status(200).json({ message: "Tutor application rejected" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal servor error" });
  }
};

const sendMail = async (name, email, id, reason) => {
  try {
    let subject, message;
    if (reason) {
      //rejection email
      subject = "Tutor Application Rejection";
      message = `Hi ${name},\n\nWe regeret to inform you that your tutor application has been rejected due to the following :${reason}\n\nIf you have any questions,please contact our support team;`;
    } else {
      //approval email
      subject = "Tutor Application Approval";
      message = `Hi ${name},\n\nCongrtulations!Your tutor application has been approved .\n\nPlease click the following link to verify your account: <a href="http://localhost:4200/tutor/tutor-login">click here </a>\n\nIf you have any questions, please contact our support team.`;
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTls: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.Pass,
      },
    });
    const mailOptions = {
      from: "WEB LEARN",
      to: email,
      subject: subject,
      html: message,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email send-->", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

//-----------Block tutor---//

export const blockTutor = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Bad Request: Tutor ID is required." });
    }
    console.log("Blocking tutor with ID:", id); // Add this line for debugging
    const updateTutor = await tutorModel.findByIdAndUpdate(
      id,
      { $set: { is_blocked: true } },
      { new: true }
    );
    if (updateTutor) {
      res.json(updateTutor);
    } else {
      res.status(400).json({
        message: "tutor blocking failed",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//-------------Unblock tutor--------------------//
export const unblockTutor = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ message: "Bad Request: Tutor ID is required." });
    }
    console.log("Unblocking tutor with ID:", id); // Add this line for debugging
    const updateTutor = await tutorModel.findByIdAndUpdate(
      id,

      { $set: { is_blocked: false } },
      { new: true }
    );
    if (updateTutor) {
      res.json(updateTutor);
    } else {
      res.json(400).json({
        message: "tutor unblocking failed",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
