import Posts from '../models/posts.js'

const getPosts = async (req, res) => {
    try {
        const posts = await Posts.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json(error)
    }
}

const createPost = async (req, res) => {
    try {
        const newPost = new Posts(req.body)
        newPost.tags = req.body.tags.split(",")
        console.log(newPost.tags);
        
        if (req.file) newPost.selected_file = req.file.filename
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(400).json(error)
    }
}
const updatePost = async (req, res) => {
    try {
        const { id } = req.params
        const post = req.body
        post.tags = post.tags.split(",")
        const updatedPost = await Posts.findByIdAndUpdate(id, post, { new: true, runValidators: true })
        if (req.file) updatedPost.selected_file = req.file.filename
        await updatedPost.save()
        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(400).json(error)
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const deletedPost = await Posts.findByIdAndDelete(id)
        res.status(200).json(deletedPost)
    } catch (error) {
        res.status(404).json(error)
    }
}



export {
    getPosts,
    createPost,
    updatePost,
    deletePost
}