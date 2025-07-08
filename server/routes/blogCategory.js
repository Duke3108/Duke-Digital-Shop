import express from 'express'
import { isAdmin, verifyAccessToken } from '../middlewares/verifyToken.js'
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/blogCategory.js'

const blogCategoryRouter = express.Router()

blogCategoryRouter.post('/', [verifyAccessToken, isAdmin], createCategory)
blogCategoryRouter.get('/', getAllCategories)
blogCategoryRouter.put('/:bcid', [verifyAccessToken, isAdmin], updateCategory)
blogCategoryRouter.delete('/:bcid', [verifyAccessToken, isAdmin], deleteCategory)


export default blogCategoryRouter