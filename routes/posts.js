import express from "express";
import { createPost, deletePost, getPosts, likePost, updatePost } from "../controllers/posts.js";
import upload from '../middlewares/multer.js'
import { postValidationSchema } from "../middlewares/validations.js";
import authMiddleWare from "../middlewares/auth.js";


const router = express.Router()

console.log(postValidationSchema);


router.route('/')
    .get(getPosts)
    .post(upload.single('selected_file'), postValidationSchema(), createPost)

router.route('/like-post/:id')
    .post(authMiddleWare, likePost)

router.route('/:id')
    .patch(upload.single('selected_file'), postValidationSchema(), updatePost)
    .delete(deletePost)


export default router