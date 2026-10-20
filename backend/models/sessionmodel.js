import mongoose from "mongoose";

const sessionschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    refreshToken: {
        type: String,
        required: true
    }
});

export const Session = mongoose.model("Session", sessionschema);