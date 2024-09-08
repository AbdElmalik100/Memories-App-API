import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({
    // The user who will receive the notification
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    // The user who triggered the notification (e.g., someone who liked the post)
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    // The type of notification (like, comment, follow, etc.)
    type: {
        type: String,
        enum: ['like', 'comment', 'follow', 'new_post'],
        required: true
    },
    // Reference to the related post (if applicable)
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts',
        required: function () {
            return this.type === 'like' || this.type === 'comment' || this.type === 'new_post';
        }
    },
    // Whether the notification has been read by the recipient
    isRead: {
        type: Boolean,
        default: false
    },
    // Notification message (optional, for custom messages)
    message: {
        type: String,
        default: ''
    },
    // Timestamp of when the notification was created
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Notifications = mongoose.model("Notifications", notificationSchema)

export default Notifications
