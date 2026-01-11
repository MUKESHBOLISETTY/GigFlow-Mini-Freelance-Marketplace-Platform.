import mongoose from 'mongoose';
const ProjectSchema = new mongoose.Schema(
    {

    },
    {
        timestamps: true,
    }
);


export const Project = mongoose.model("Project", ProjectSchema);