import tutorModel from "../model/tutorModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from 'nodemailer'
import jwt from "jsonwebtoken";
dotenv.config()

//---------tutor Register-----//
export const tutorRegister = async(req,res)=>{
    try {
        console.log(req.body);
        const {name,qualification,email,password }=req.body;
        const cv = req.file.filename
        const tutorExist = await tutorModel.findOne({email:email});
        if(tutorExist){

            return res.status(400).json({
                message:'tutor is already exist',
            })
        }

        const salt =await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);

        const tutor = new tutorModel({
            name,
            email,
            qualification,
            cv,
            password:hashPassword
        });
        const result = await tutor.save();
        if(result){
            sendMail(result.name,result.email,result._id)
            res.status(200).json(result)
        }else{
            res.status(400).send({
                message:"Can't registered,Something went wrong"
            })
        }
    } catch (error) {
        console.log(error);
    }
}

//----send mail verification--//

const sendMail =async(name,email,id)=>{
    try {
        console.log(process.env.EMAIL,process.env.Pass);
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTls:true,
            auth:{
                user:process.env.EMAIL,
                pass:process.env.Pass
            }
        })
        const mailOptions = {
            from:'WEB LEARN',
            to:email,
            subject:'For verification mail',
            html: ` <html>
            <body>
                <h1>WEB LEARN Account for Tutor Verification</h1>
                <p>Hi ${name},</p>
                <p>Thank you for signing up with Web Learn. Please click the button below to verify your account:</p>
              
                    <img src="https://www.nicepng.com/png/detail/960-9602830_email-verification-email-verify-icon-png.png" alt="Verification Image" width="500" height="300"><br>
                    <div style="text-align: center;">
                    <a href="http://localhost:4200/tutor/tutor-login/${id}" style="text-decoration: none;">
                        <button style="background-color: #008CBA; color: white; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
                            Verify Account
                        </button>
                    </a>
                </div>
        
                <p>If you have any questions or need assistance, please contact our support team.</p>
            </body>
        </html>
                `,
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
            }else{
                console.log("Email send-->",info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

//---user verification-------//

export const Verification = async(req,res)=>{
    try {
        const id = req.query.id;
        console.log(id);
        const tutordata = await tutorModel.findOne({_id:id});
        if(tutordata){
            await tutorModel.updateOne({_id:id},{is_verified:true});
            const token = jwt.sign({_id:tutordata._id},process.env.TUTORSECRETKEY)
            res.json(token)
        }else{
            res.status(400).send({
                message:"something went wrong"
            })
        }

    } catch (error) {
        console.log(error.message);
    }
}

//-----user login---------//

export const tutorLogin = async(req,res)=>{
    try {
        console.log('hiii');
        const {email,password} = req.body
        console.log(req.body);

        const tutorData = await tutorModel.findOne({email:email})
        if(!tutorData){
            return res.status(404).send({
                
                    message:'Tutor not found'
                })
             }
             if(!(await bcrypt.compare(password,tutorData.password))){
                return res.status(404).send({
                    message:"Password is not correct"
                })
             }

             if(tutorData.is_verified){
                const token = jwt.sign({_id:tutorData.id},process.env.TUTORSECRETKEY)
                res.json(token)
             }else{
                return res.status(404).send({
                    message:"email not verified"
                })
             }
    } catch (error) {
        console.log(error.message);
    }
}



//-----user login---------//

export const tutorNotApprouved = async(req,res)=>{
    try {
        console.log('worked');

        const tutorDAta = await tutorModel.find({is_approve:'waiting'})
        if(tutorDAta){
            res.status(200).json(tutorDAta)
        }else{
            res.status(400).json({
                message:"something went wrong"
            })
        }
      

        
    } catch (error) {
        console.log(error.message);
    }
}