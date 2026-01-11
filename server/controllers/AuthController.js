import { OTP } from '../models/OTP.js'
import bcrypt from "bcrypt";
import otpGenerator from 'otp-generator';
import uniqid from 'uniqid';
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()
import { respond } from '../utils/respond.js';
import { Freelancer } from '../models/Freelancer.js';
const tokenGenerator = async (email, sessionId) => {
    const payload = {
        email,
        sessionId
    };
    const newtoken = jwt.sign(payload, process.env.JWT_SECRET);
    return newtoken;
}

export const signup = async (req, res) => {
    try {
        const { username, email, phoneNumber, gender, password } = req.body;
        const allowedFields = ['username', 'email', 'phoneNumber', 'gender', 'password'];
        const receivedFields = Object.keys(req.body);
        const unknownFields = receivedFields.filter(field => !allowedFields.includes(field));

        if (unknownFields.length > 0) {
            return respond(res, "Denied", 400, false);
        }
        if (!username || !phoneNumber || !email || !gender || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        if (password.length < 8) {
            return respond(res, "Password must be at least 8 characters long", 400, false);
        }

        const mail = email.trim().toLowerCase()
        const existingUsers = await Freelancer.findOne({ email: mail }).select("email");
        if (existingUsers) {
            return respond(res, "User already exists. Try to login.", 400, false);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const uid = uniqid()
        const freshtoken = await tokenGenerator(mail, uid)
        const phone = parseInt(phoneNumber)
        const user = await Freelancer.create({
            token: freshtoken, sessionId: uid, username, email: mail, phoneNumber: phone, password: hashedPassword, gender, verified: false
        })
        const recentOtp = await OTP.find({ email: mail }).sort({ createdAt: -1 }).limit(1);

        if (recentOtp.length == 0) {
            const otp = await sendOtp(mail);
            if (!otp || typeof otp !== 'string' || otp.includes("Error")) {
                return respond(res, "Error Occured", 500, false);
            }
        }

        return res.status(200).json({
            success: true,
            message: "user_registered",
        });

    } catch (error) {
        console.log(error)
        return respond(res, "User cannot be registered. Please try again", 500, false);
    }
}
