import Brand from '../models/brand.js'
import asyncHandler from "express-async-handler";

export const createBrand = asyncHandler(async (req, res) => {
    const response = await Brand.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        createdBrand: response ? response : 'Can not create new Brand'
    })
})

export const getAllBrands = asyncHandler(async (req, res) => {
    const response = await Brand.find().select('title _id')
    return res.status(200).json({
        success: response ? true : false,
        brands: response ? response : 'Can not find any brand'
    })
})

export const updateBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await Brand.findByIdAndUpdate(bid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedBrand: response ? response : 'Can not update this brand'
    })
})

export const deleteBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const response = await Brand.findByIdAndDelete(bid)
    return res.status(200).json({
        success: response ? true : false,
        deletedBrand: response ? response : 'Can not delete this brand'
    })
})