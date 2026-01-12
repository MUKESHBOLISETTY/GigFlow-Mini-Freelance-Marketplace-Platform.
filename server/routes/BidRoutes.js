import express from "express";
import { rateLimit } from 'express-rate-limit'
import { authenticateUser } from "../middlewares/AuthMiddleware.js";
import { createBid, hireFreelancer } from "../controllers/BidController.js";
const router = express.Router();
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
})

router.patch("/:bidId/hire", limiter, authenticateUser, hireFreelancer);

router.post("/", limiter, authenticateUser, createBid);

router.get("/:gigId", limiter, authenticateUser, createBid);

export default router;