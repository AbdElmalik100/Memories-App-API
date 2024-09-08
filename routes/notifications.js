import express from "express";
import { getNotificationsForUser } from "../controllers/notifications.js";
import authMiddleWare from "../middlewares/auth.js";


const router = express.Router()


router.route('/')
    .get(authMiddleWare, getNotificationsForUser)


export default router