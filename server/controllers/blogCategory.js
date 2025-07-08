import BlogCategory from '../models/blogCategory.js'
import asyncHandler from "express-async-handler";

export const createCategory = asyncHandler(async (req, res) => {
    const response = await BlogCategory.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        createdCategory: response ? response : 'Can not create new product category'
    })
})

export const getAllCategories = asyncHandler(async (req, res) => {
    const response = await BlogCategory.find().select('title _id')
    return res.status(200).json({
        success: response ? true : false,
        blogCategories: response ? response : 'Can not find any product category'
    })
})

export const updateCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params
    const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedCategory: response ? response : 'Can not update this product category'
    })
})

export const deleteCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params
    const response = await BlogCategory.findByIdAndDelete(bcid)
    return res.status(200).json({
        success: response ? true : false,
        deletedCategory: response ? response : 'Can not delete this product category'
    })
})