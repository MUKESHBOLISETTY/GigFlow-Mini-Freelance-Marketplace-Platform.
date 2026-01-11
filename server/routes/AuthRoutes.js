import express from "express";
import { rateLimit } from 'express-rate-limit'
import { login, resendOtp, resetPassword, sendForgotPasswordOtp, signup, verifyForgotPasswordOtp, verifyOtp } from "../controllers/AuthController.js";
const router = express.Router();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 15,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
})

router.post("/login", limiter, login);

router.post("/signup", limiter, signup);

router.post("/verifyOtp", limiter, verifyOtp);

router.post("/resendOtp", limiter, resendOtp);

router.post("/sendForgotPasswordOtp", limiter, sendForgotPasswordOtp);

router.post("/verifyForgotPasswordOtp", limiter, verifyForgotPasswordOtp);

router.post("/resetPassword", limiter, resetPassword);

export default router;