import express from "express";
import { createPost, deletePost, getPosts, updatePost } from "../controllers/posts.js";
import upload from '../middlewares/multer.js'


const router = express.Router()

router.route('/')
    .get(getPosts)
    .post(upload.single('selected_file'), createPost)

router.route('/:id')
    .patch(upload.single('selected_file'), updatePost)
    .delete(deletePost)


export default router