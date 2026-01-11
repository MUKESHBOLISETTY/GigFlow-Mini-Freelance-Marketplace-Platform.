import { sendProjectsClientUpdater } from "../middlewares/ServerSentUpdates.js";
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

        await sendProjectsClientUpdater(req.user._id)

        return res.status(201).json({
            success: true,
            message: "project_posted",
            project: newProject
        });

    } catch (error) {
        return respond(res, "Error Occured", 500, false);
    }
};

export const getClientProjects = async (clientId, verified = false) => {
    try {
        const projects = verified ? await Project.find({ clientId }).sort({ createdAt: -1 }) : null;
        if (!projects) {
            throw new Error("Projects not found");
        } else {
            return projects;
        }
    } catch (error) {
        console.log(err)
    }
};

