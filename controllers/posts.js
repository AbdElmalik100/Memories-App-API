import { validationResult } from 'express-validator'
import Posts from '../models/posts.js'
import { io } from '../index.js'

const getPosts = async (req, res) => {
    try {
        const query = req.query
        const filter = []

        const LIMIT = 4

        const startIndex = (+query.page - 1) * LIMIT
        const total = await Posts.countDocuments({})
        const numberOfPages = Math.ceil(total / LIMIT)

        if (query.search) {
            filter.push({ title: { $regex: query.search, $options: 'i' } })
        }
        if (query.tags) {
            filter.push({ tags: { $in: query.tags.split(",") } })
        }

        if (filter.length > 0) {
            const posts = await Posts.find({ $or: filter }).populate('creator')
            return res.status(200).json({ data: posts, pages: numberOfPages, current_page: +query.page })
        }

        const posts = await Posts.find().sort({ _id: "desc" }).limit(LIMIT).skip(startIndex).populate('creator')
        return res.status(200).json({ data: posts, pages: numberOfPages, current_page: +query.page })
    } catch (error) {
        return res.status(404).json(error)
    }
}


const createPost = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json(errors.mapped())
        const newPost = new Posts(req.body)

        if (newPost.tags.length > 0) newPost.tags = req.body.tags.split(",")
        if (req.file) newPost.selected_file = req.file.filename

        await newPost.save()
        await newPost.populate('creator')
        
        return res.status(201).json(newPost)
    } catch (error) {
        console.log(error);
        return res.status(400).json(error)
    }
}
const updatePost = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json(errors.mapped())

        const { id } = req.params
        const post = req.body

        for (let key in post) key === 'selected_file' ? post[key] = post[key] : post[key] = JSON.parse(post[key])

        // if (!Array.isArray(post.tags)) post.tags = post.tags.split(",")
        const updatedPost = await Posts.findByIdAndUpdate(id, post, { new: true, runValidators: true }).populate('creator')

        if (req.file) updatedPost.selected_file = req.file.filename
        await updatedPost.save()

        return res.status(200).json(updatedPost)
    } catch (error) {
        return res.status(400).json(error)
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const deletedPost = await Posts.findByIdAndDelete(id)
        return res.status(200).json(deletedPost)
    } catch (error) {
        return res.status(404).json(error)
    }
}

const likePost = async (req, res) => {
    try {
        const { id } = req.params
        const user = req.userInfo
        if (!user) return res.status(401).json({ authorization: "your are unauthorized" })

        const post = await Posts.findById(id)
        if (!post) return res.status(404).json({ error: "Post not found" })

        const userExist = post.likes.findIndex(postId => postId === user.id)
        if (userExist === -1) {
            post.likes.push(user.id)
        } else post.likes = post.likes.filter(el => el !== user.id)

        const likedPost = await Posts.findByIdAndUpdate(id, post, { new: true }).populate("creator")


        return res.status(200).json(likedPost)

    } catch (error) {

        return res.status(400).json(error)
    }
}



export {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    likePost
}



