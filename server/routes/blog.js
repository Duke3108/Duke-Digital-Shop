import express from 'express'
import { isAdmin, verifyAccessToken } from '../middlewares/verifyToken.js'
import { createBlog, deleteBlog, dislikeBlog, getAllBlogs, getBlog, likeBlog, updateBlog, uploadImageBlog } from '../controllers/blog.js'
import uploader from '../config/cloudinary.config.js'

const blogRouter = express.Router()

blogRouter.get('/', getAllBlogs)
blogRouter.get('/:bid', getBlog)
blogRouter.post('/', [verifyAccessToken, isAdmin], createBlog)
blogRouter.put('/uploadimage/:bid', [verifyAccessToken, isAdmin], uploader.single('image'), uploadImageBlog)
blogRouter.put('/like/:bid', verifyAccessToken, likeBlog)
blogRouter.put('/dislike/:bid', verifyAccessToken, dislikeBlog)
blogRouter.put('/:bid', [verifyAccessToken, isAdmin], updateBlog)
blogRouter.delete('/:bid', [verifyAccessToken, isAdmin], deleteBlog)

export default blogRouter