import * as mongoose from "mongoose"

export const verificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    verificationID: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})