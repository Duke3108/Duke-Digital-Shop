import express from 'express'
import { isAdmin, verifyAccessToken } from '../middlewares/verifyToken.js'
import { createOrder, getAllOrders, getUserOrders, updateStatus } from '../controllers/order.js'

const orderRouter = express.Router()

orderRouter.post('/', verifyAccessToken, createOrder)
orderRouter.put('/status/:oid', [verifyAccessToken, isAdmin], updateStatus)
orderRouter.get('/admin', [verifyAccessToken, isAdmin], getAllOrders)
orderRouter.get('/', verifyAccessToken, getUserOrders)

export default orderRouter