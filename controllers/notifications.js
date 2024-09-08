import Notifications from "../models/notifications.js"


export const createNotification = async (recipientId, senderId, type, postId, message) => {
    const notification = new Notifications({
        recipient: recipientId,
        sender: senderId,
        type,
        post: postId,
        message
    })
    await notification.save()
    await notification.populate("sender")
    await notification.populate("post")
}

export const getNotificationsForUser = async (req, res) => {
    try {
        const userInfo = req.userInfo
        
        const userNotifications = await Notifications
            .find({ recipient: userInfo.id })
            .populate("sender")
            .populate("post")
            .sort({ "created_at": "desc" })

        res.status(200).json(userNotifications)
    } catch (error) {
        console.log(error);
        res.status(404).json(error)
    }
}