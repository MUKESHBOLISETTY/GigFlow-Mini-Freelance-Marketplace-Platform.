import mongoose from 'mongoose';
const BidSchema = new mongoose.Schema(
    {

    },
    {
        timestamps: true,
    }
);


export const Bid = mongoose.model("Bid", BidSchema);