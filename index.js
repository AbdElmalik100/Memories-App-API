import express from "express";
import cors from 'cors'
import mongoose from "mongoose";
import 'dotenv/config'
import postRouter from './routes/posts.js'
import usersRouter from './routes/users.js'
import userNotifications from './routes/notifications.js'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from "http";
import { Server } from "socket.io";
import { createNotification } from "./controllers/notifications.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express()
const server = createServer(app)
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
})

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to our Memories web application API, Feel free to use it."
    })
})

const mongooseUrl = process.env.MONGOOSE_URL
const port = process.env.PORT


mongoose.connect(mongooseUrl)
    .then(() => {
        console.log("MongoDB is running");
    }).catch(error => {
        console.log("MongoDB connection error: ", error);
    })

app.use('/api/posts', postRouter)
app.use('/api/users', usersRouter)
app.use('/api/notifications', userNotifications)



const connectedUsers = {}
io.on('connection', socket => {
    console.log('user has been connected: ', socket.id);

    socket.on("user_register", userID => connectedUsers[userID] = socket.id)

    socket.on("new post", post => {
        socket.broadcast.emit("notification", {
            type: "new memory here",
            message: `A new memory has been added`,
            post
        })

    })
    socket.on("like_post", payload => {
        if (payload.post.likes.includes(payload.user._id)) {
            socket.to(connectedUsers[payload.post.creator._id]).emit("like_notification", {
                post: payload.post,
                user: payload.user
            })
            createNotification(payload.post.creator._id, payload.user._id, 'like', payload.post._id, 'liked your post')
        }
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected: ", socket.id);
        for (let userId in connectedUsers) {
            if (connectedUsers[userId] === socket.id) {
                delete connectedUsers[userId];
                break;
            }
        }
    });
})



server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})