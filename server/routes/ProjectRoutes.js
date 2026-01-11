import express from "express";
import { rateLimit } from 'express-rate-limit'
import { authenticateUser } from "../middlewares/AuthMiddleware.js";
import { createProject, getClientProjects } from "../controllers/ProjectController.js";
const router = express.Router();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
})

router.post("/createProject", limiter, authenticateUser, createProject);

router.get("/getClientProjects", limiter, authenticateUser, getClientProjects);

export default router;