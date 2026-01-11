import express from "express";
import { rateLimit } from 'express-rate-limit'
import { signup } from "../controllers/AuthController.js";
const router = express.Router();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 15,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
})

router.post("/signup", limiter, signup);

export default router;