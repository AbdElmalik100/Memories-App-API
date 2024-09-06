import express from "express";
import { getAllUser, googleOAuth, login, me, register } from "../controllers/users.js";
import authMiddleWare from "../middlewares/auth.js";
import { loginValidationSchema, registerValidationSchema } from "../middlewares/validations.js";



const router = express.Router()

router.route('/me')
    .get(authMiddleWare, me)

router.route('/')
    .get(getAllUser)

router.route('/login')
    .post(loginValidationSchema(), login)

router.route('/register')
    .post(registerValidationSchema(), register)

router.route('/googleOAuth')
    .post(googleOAuth)

export default router