import express from "express";
import { rateLimit } from 'express-rate-limit'
import { authenticateUser } from "../middlewares/AuthMiddleware.js";
import { createProject, fetchAllProjects, getClientProjects, getProjectById } from "../controllers/ProjectController.js";
const router = express.Router();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
})

router.post("/", limiter, authenticateUser, createProject);

router.get("/getClientProjects", limiter, authenticateUser, getClientProjects);

router.get("/", limiter, authenticateUser, fetchAllProjects);

router.get("/:id", limiter, authenticateUser, getProjectById);

export default router;