import express from 'express'
import { addVarriant, createProduct, deleteProduct, getAllProducts, getProduct, rating, updateProduct, uploadImagesProduct } from '../controllers/product.js'
import { isAdmin, verifyAccessToken } from '../middlewares/verifyToken.js'
import uploader from '../config/cloudinary.config.js'

const productRouter = express.Router()

productRouter.post('/', [verifyAccessToken, isAdmin], uploader.fields([
    { name: 'images', maxCount: 20 },
    { name: 'thumb', maxCount: 1 }
]), createProduct)
productRouter.get('/', getAllProducts)
productRouter.put('/rating', verifyAccessToken, rating)

productRouter.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.fields([
    { name: 'images', maxCount: 20 },
    { name: 'thumb', maxCount: 1 }
]), uploadImagesProduct)
productRouter.put('/variant/:pid', [verifyAccessToken, isAdmin], uploader.fields([
    { name: 'images', maxCount: 20 },
    { name: 'thumb', maxCount: 1 }
]), addVarriant)
productRouter.put('/:pid', [verifyAccessToken, isAdmin], uploader.fields([
    { name: 'images', maxCount: 20 },
    { name: 'thumb', maxCount: 1 }
]), updateProduct)
productRouter.delete('/:pid', [verifyAccessToken, isAdmin], deleteProduct)
productRouter.get('/:pid', getProduct)

export default productRouter