import express from 'express'
import { isAdmin, verifyAccessToken } from '../middlewares/verifyToken.js'
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/productCategory.js'

const productCategoryRouter = express.Router()

productCategoryRouter.post('/', [verifyAccessToken, isAdmin], createCategory)
productCategoryRouter.get('/', getAllCategories)
productCategoryRouter.put('/:pcid', [verifyAccessToken, isAdmin], updateCategory)
productCategoryRouter.delete('/:pcid', [verifyAccessToken, isAdmin], deleteCategory)


export default productCategoryRouter