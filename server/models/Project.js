import mongoose from 'mongoose';
const ProjectSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
        },
        budgetType: { type: String, enum: ['fixed', 'hourly'], default: 'fixed' },
        budgetRange: {
            min: Number,
            max: Number
        },
        skillsRequired: [String],
        status: {
            type: String,
            enum: ['open', 'assigned', 'rejected'],
            default: 'open'
        },
        contractAddress: { type: String },
        deadline: Date
    },
    {
        timestamps: true,
    }
);

export const Project = mongoose.model("Project", ProjectSchema);