import mongoose from "mongoose";


const postsSchema = new mongoose.Schema({
    created_at: {
        type: Date,
        default: new Date()
    },
    creator: {
        type: String,
        required: [true, "This field is required"],
        lowercase: true,
        maxLength: [255, "Must be less than 255 character"]
    },
    title: {
        type: String,
        required: [true, "This field is required"],
        lowercase: true,
        maxLength: [255, "Must be less than 255 character"]
    },
    message: {
        type: String,
        required: [true, "This field is required"],
        lowercase: true,
        maxLength: [255, "Must be less than 255 character"]
    },
    tags: {
        type: [String],
        required: [true, "This field is required"],
    },
    selected_file: {
        type: String,
        maxLength: [255, "Must be less than 255 character"]
    },
    like_count: {
        type: Number,
        default: 0
    }
})

const Posts = mongoose.model("Posts", postsSchema)

export default Posts