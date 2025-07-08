import ProductCategory from "../models/productCategory.js"
import asyncHandler from "express-async-handler";

export const createCategory = asyncHandler(async (req, res) => {
    const response = await ProductCategory.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        createdCategory: response ? response : 'Can not create new product category'
    })
})

export const getAllCategories = asyncHandler(async (req, res) => {
    const response = await ProductCategory.find()
    return res.status(200).json({
        success: response ? true : false,
        prodCategories: response ? response : 'Can not find any product category'
    })
})

export const updateCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params
    const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedCategory: response ? response : 'Can not update this product category'
    })
})

export const deleteCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params
    const response = await ProductCategory.findByIdAndDelete(pcid)
    return res.status(200).json({
        success: response ? true : false,
        deletedCategory: response ? response : 'Can not delete this product category'
    })
})