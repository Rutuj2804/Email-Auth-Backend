import * as mongoose from "mongoose"

export const forgotSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    forgotID: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})