import mongoose from "mongoose";
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
            contractAddress,
            deadline
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required."
            });
        }

        const newProject = new Project({
            title,
            description,
            clientId: req.user._id,
            budgetType,
            budgetRange,
            skillsRequired,
            contractAddress,
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

export const hireFreelancer = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const { bidId, projectId } = req.body;

        const project = await Project.findById(projectId).session(session);
        if (!project) {
            return respond(res, "Project Not Found.", 400, false);
        }
        if (project.clientId.toString() !== req.user._id.toString()) {
            return respond(res, "Unauthorized: Access denied.", 403, false);
        }
        if (project.status !== 'open') {
            throw new Error("This project is already assigned or closed.");
        }
        const hiredBid = await Bid.findOneAndUpdate(
            { _id: bidId, projectId: projectId },
            { status: 'hired' },
            { session, new: true }
        );
        if (!hiredBid) {
            throw new Error("Bid not found.");
        }
        project.status = 'assigned';
        await project.save({ session });

        await Bid.updateMany(
            {
                projectId: projectId,
                _id: { $ne: bidId },
                status: 'open'
            },
            { status: 'rejected' },
            { session }
        );
        await session.commitTransaction();

        return respond(res, "freelancer_hired", 200, true);

    } catch (error) {
        await session.abortTransaction();
        console.error("Transaction Aborted. Error:", error.message);
        return respond(res, "Failed to complete the hiring process.", 400, false);
    } finally {
        await session.endSession();
    }
};
