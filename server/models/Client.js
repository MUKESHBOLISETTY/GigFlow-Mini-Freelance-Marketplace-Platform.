import mongoose from 'mongoose';
const ClientSchema = new mongoose.Schema(
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
        type: {
            type: String,
            required: true,
            default: 'Client'
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
        projects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project",
            }
        ]
    },
    {
        timestamps: true,
    }
);


export const Client = mongoose.model("Client", ClientSchema);