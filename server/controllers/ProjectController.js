import { Client } from "../models/Client.js";
import { Project } from "../models/Project.js";
import { respond } from "../utils/respond.js";

export const createProject = async (req, res) => {
    try {
        if (req?.user?.type !== "Client") {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        const {
            title,
            description,
            budgetType,
            budgetRange,
            skillsRequired,
            deadline
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required."
            });
        }

        // 3. Create Project Instance
        const newProject = new Project({
            title,
            description,
            clientId: req.user._id,
            budgetType,
            budgetRange,
            skillsRequired,
            deadline,
            status: 'open'
        });

        await newProject.save();

        await Client.findByIdAndUpdate(req.user._id, {
            $push: { projects: newProject._id },
        });

        return res.status(201).json({
            success: true,
            message: "project_posted",
            project: newProject
        });

    } catch (error) {
        return respond(res, "Error Occured", 500, false);
    }
};

export const getClientProjects = async (req, res) => {
    try {
        if (req?.user.type !== "Client") {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }
        const projects = await Project.find({ clientId: req.user._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            projects
        });
    } catch (error) {
        return respond(res, "Error Occured", 500, false);
    }
};