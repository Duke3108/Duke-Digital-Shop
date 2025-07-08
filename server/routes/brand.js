import express from 'express'
import { isAdmin, verifyAccessToken } from '../middlewares/verifyToken.js'
import { createBrand, deleteBrand, getAllBrands, updateBrand } from '../controllers/brand.js'

const brandRouter = express.Router()

brandRouter.post('/', [verifyAccessToken, isAdmin], createBrand)
brandRouter.get('/', getAllBrands)
brandRouter.put('/:bid', [verifyAccessToken, isAdmin], updateBrand)
brandRouter.delete('/:bid', [verifyAccessToken, isAdmin], deleteBrand)


export default brandRouter