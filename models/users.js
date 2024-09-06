import mongoose from "mongoose";
import validator from "validator";


const usersSchema = new mongoose.Schema({
    created_at: {
        type: Date,
        default: new Date()
    },
    first_name: {
        type: String,
        lowercase: true,
        trim: true,
    },
    last_name: {
        type: String,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
    },
    avatar: {
        type: String,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
})

usersSchema.virtual('posts', {
    ref: 'Posts',
    localField: '_id',
    foreignField: 'creator',
});

// Ensure virtual fields are included in JSON output
usersSchema.set('toObject', { virtuals: true });
usersSchema.set('toJSON', { virtuals: true });

const Users = mongoose.model("Users", usersSchema)

export default Users