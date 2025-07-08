import express from 'express'
import { isAdmin, verifyAccessToken } from '../middlewares/verifyToken.js'
import { createCoupon, deleteCoupon, getAllCoupons, updateCoupon } from '../controllers/coupon.js'

const couponRouter = express.Router()

couponRouter.get('/', getAllCoupons)
couponRouter.post('/', [verifyAccessToken, isAdmin], createCoupon)
couponRouter.put('/:cid', [verifyAccessToken, isAdmin], updateCoupon)
couponRouter.delete('/:cid', [verifyAccessToken, isAdmin], deleteCoupon)

export default couponRouter