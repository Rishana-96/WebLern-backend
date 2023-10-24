import userModel from '../model/userModel.js';
import tutorModel from '../model/tutorModel.js';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

//---------Admin Login-----------------//

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const adminData = await userModel.findOne({ email: email })
        if (!adminData) {
            res.status(400).json({
                message: "incorrect email"
            })
        }
        if (!(await bcrypt.compare(password, adminData.password))) {
            res.status(400).json({
                message: 'password is incorrect'
            })
        }
        if (adminData.is_admin) {
            const token = Jwt.sign({ _id: adminData._id }, process.env.ADMINSECRETKEY)
            res.json(token)
        } else {
            return res.status(400).json({
                message: 'you are not admin'
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}

//----------userlist fetching------//

export const userList = async (req, res) => {
    try {
        const userList = await userModel.find({ is_admin: false })
        console.log(userList);
        res.status(200).json(userList)

    } catch (error) {
        console.log(error.message);
    }
}



//-----tutor list---------//

export const tutorNotApproved = async (req, res) => {
    try {
        console.log('worked');

        const tutorData = await tutorModel.find()
        if (tutorData) {
            res.status(200).json(tutorData)
        } else {
            res.status(400).json({
                message: "something went wrong"
            })
        }



    } catch (error) {
        console.log(error.message);
    }
}

//-----------Block user---//

export const blockUser = async (req, res) => {
    try {
        const { id } = req.body
        const updateUser = await userModel.updateOne(
            { _id: id },
            { $set: { is_blocked: true } }
        );
        if (updateUser) {
            res.json(updateUser)
        } else {
            res.status(400).json({
                message: "user blocking failed"
            })
        }
    } catch (error) {
        console.log(error.message);
    }

}

//-------------Unblock user--------------------//
export const unblockUser = async (req, res) => {
    try {
        const { id } = req.body
        const updateUser = await userModel.updateOne(
            { _id: id },
            { $set: { is_blocked: false } }
        );
        if (updateUser) {
            res.json(updateUser)
        } else {
            res.json(400).json({
                message: "user unblocking failed"
            })
        }
    } catch (error) {
        console.log(error.message);

    }
}

//----------tutor approval----------/

export const approveTutor = async (req, res) => {
    try {
        console.log('hii');
        const { id, status } = req.body;
        console.log(req.body);
        const tutorData = await tutorModel.findById(id);
        if (!tutorData) {
            return res.status(404).json({ message: 'Tutor not found' });
        }
        if (tutorData.is_approve !== 'waiting') {
            return res.status(400).json({ message: 'Tutor application has been processed' });
        }

        //update tutors approval status
        tutorData.is_approve = status;
        await tutorData.save();
        res.status(200).json({ message: `Tutor application ${status === 'approved' ? 'approved' : 'rejected'}` })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal servor error' })

    }
}

//----------tutor reject----------/

export const rejectTutor = async (req, res) => {
    try {

        const { id, status } = req.body;
        console.log(req.body);
        const tutorData = await tutorModel.findById(id);
        if (!tutorData) {
            return res.status(404).json({ message: 'Tutor not found' });
        }
        if (tutorData.is_approve !== 'waiting') {
            return res.status(400).json({ message: 'Tutor application has been processed' });
        }

        //update tutors approval status
        tutorData.is_approve = 'rejected';
        await tutorData.save();
        res.status(200).json({ message: 'Tutor application rejected' })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal servor error' })

    }
}
