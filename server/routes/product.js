import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getProduct, rating, updateProduct, uploadImagesProduct } from '../controllers/product.js'
import { isAdmin, verifyAccessToken } from '../middlewares/verifyToken.js'
import uploader from '../config/cloudinary.config.js'

const productRouter = express.Router()

productRouter.post('/', [verifyAccessToken, isAdmin], uploader.array('images', 10), createProduct)
productRouter.get('/', getAllProducts)
productRouter.put('/rating', verifyAccessToken, rating)

productRouter.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.array('images', 10), uploadImagesProduct)
productRouter.put('/:pid', [verifyAccessToken, isAdmin], updateProduct)
productRouter.delete('/:pid', [verifyAccessToken, isAdmin], deleteProduct)
productRouter.get('/:pid', getProduct)

export default productRouter