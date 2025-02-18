import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from '../controllers/product.js'
import { isAdmin, verifyAccessToken } from '../middlewares/verifyToken.js'

const productRouter = express.Router()

productRouter.post('/', [verifyAccessToken, isAdmin], createProduct)
productRouter.get('/', getAllProducts)


productRouter.delete('/:pid', [verifyAccessToken, isAdmin], deleteProduct)
productRouter.put('/:pid', [verifyAccessToken, isAdmin], updateProduct)
productRouter.get('/:pid', getProduct)

export default productRouter