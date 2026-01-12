import mongoose from "mongoose";
import { Project } from "../models/Project";
import { Bid } from "../models/Bid";
import { respond } from "../utils/respond";

export const hireFreelancer = async (req, res) => {
    if (req?.user.type !== "Client") {
        return respond(res, "Access denied.", 403, false);
    }
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const { projectId } = req.body;
        const bidId = req.params.bidId;

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
