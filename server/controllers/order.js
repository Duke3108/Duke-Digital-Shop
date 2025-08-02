import Order from '../models/order.js'
import User from '../models/user.js'
import Coupon from '../models/coupon.js'
import asyncHandler from "express-async-handler";

export const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { products, total, address, status } = req.body
    if (!products || !total || !address) throw new Error('Missing required fields')
    const createData = { products, total, orderBy: _id, address }
    if (status) {
        createData.status = status
    }
    const rs = await Order.create(createData)
    if (rs) await User.findByIdAndUpdate(_id, { cart: [] })
    return res.status(200).json({
        success: rs ? true : false,
        rs: rs ? rs : 'Cannot create new order'
    })
})

export const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const { status } = req.body
    if (!status) throw new Error('Missing status')
    const response = await Order.findByIdAndUpdate(oid, { status }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'Cannot update status'
    })
})

export const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const response = await Order.find({ orderBy: _id })
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'Cannot get order'
    })
})

export const getAllOrders = asyncHandler(async (req, res) => {
    const response = await Order.find()
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'Cannot get any order'
    })
})
