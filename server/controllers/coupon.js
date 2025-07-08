import Coupon from "../models/coupon.js";
import asyncHandler from "express-async-handler";

export const createCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expiry } = req.body
    if (!name || !discount || !expiry) throw new Error('Missing inputs')
    const response = await Coupon.create({
        ...req.body,
        expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000
    })
    return res.status(200).json({
        success: response ? true : false,
        createdCoupon: response ? response : 'Cannot create new coupon'
    })
})

export const getAllCoupons = asyncHandler(async (req, res) => {
    const response = await Coupon.find().select('-createdAt -updatedAt ')
    return res.status(200).json({
        success: response ? true : false,
        coupons: response ? response : 'Can not find any coupon'
    })
})

export const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body.expiry) req.body.expiry = Date.now() + +expiry * 24 * 60 * 60 * 1000
    const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Can not update this coupon'
    })
})

export const deleteCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params
    const response = await Coupon.findByIdAndDelete(cid)
    return res.status(200).json({
        success: response ? true : false,
        deletedCoupon: response ? response : 'Can not delete this coupon'
    })
})