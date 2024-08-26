import express from "express";
import cors from 'cors'
import mongoose from "mongoose";
import 'dotenv/config'
import postRouter from './routes/posts.js'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()

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

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})