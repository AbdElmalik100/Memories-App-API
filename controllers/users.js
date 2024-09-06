import Users from '../models/users.js'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'



const me = async (req, res) => {
    try {
        const userInfo = req.userInfo
        const user = await Users.findOne({ email: userInfo.email, _id: userInfo.id })
        if (!user) return res.status(404).json({ error: "user not found" })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json(error)
    }
}
const getAllUser = async (req, res) => {
    try {
        const users = await Users.find({}, { password: false }).populate('posts')
        return res.status(200).json(users)
    } catch (error) {
        return res.status(404).json(error)
    }
}


const login = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json(errors.mapped())

        const userData = req.body

        const user = await Users.findOne({ email: userData.email })
        if (!user) return res.status(400).json({ invalid_credentials: "Invalid email address or password" })
        const isPasswordCorrect = await bcrypt.compare(userData.password, user.password)
        if (!isPasswordCorrect) return res.status(400).json({ invalid_credentials: "Invalid email address or password" })

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
        return res.status(200).json({ user, token })
    } catch (error) {
        return res.status(500).json(error)
    }
}

const register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json(errors.mapped())
        const userData = req.body

        if (userData.password !== userData.confirm_password) return res.status(400).json({ error: "password and confirm password didn't match" })
        userData.password = await bcrypt.hash(userData.password, 12)

        const user = new Users({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            password: userData.password,
        })

        await user.save()
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

        return res.status(200).json({ user, token })
    } catch (error) {
        return res.status(400).json(error)
    }
}


const googleOAuth = async (req, res) => {
    const accessToken = req.body.access_token
    const credentials = req.body.credentials
    let existUser
    let data
    if (accessToken !== '') {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        data = await response.json()

        existUser = await Users.findOne({ email: data.email })
    } else if (credentials !== '') {
        data = jwt.decode(credentials)
        existUser = await Users.findOne({ email: data.email })
    }


    if (existUser) {
        const token = jwt.sign({ id: existUser._id, email: existUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" })
        return res.status(200).json({ user: existUser, token })
    } else {
        const newUser = new Users({
            first_name: data.given_name,
            last_name: data.family_name,
            email: data.email,
            avatar: data.picture,
            isEmailVerified: data.email_verified
        })
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" })
        newUser.password = token
        await newUser.save()

        return res.status(200, { user: newUser, token })
    }
}


export { me, getAllUser, login, register, googleOAuth }