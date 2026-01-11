import mongoose from 'mongoose';

const FreelancerSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            // match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        phoneNumber: {
            type: Number,
            required: true,
            unique: true,
            minlength: 10,
        },
        gender: {
            type: String,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        token: {
            type: String,
        },
        sessionId: {
            type: String,
            required: true,
        },
        forgottoken: {
            type: String,
            default: null
        },
        verified: {
            type: Boolean,
            required: true,
            default: false,
        },

    },
    {
        timestamps: true,
    }
);

FreelancerSchema.index({ username: 1 });

export const Freelancer = mongoose.model("Freelancer", FreelancerSchema);