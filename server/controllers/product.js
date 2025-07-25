import Product from "../models/product.js";
import asyncHandler from "express-async-handler";
import slugtify from 'slugify'

export const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.title) {
        req.body.slug = slugtify(req.body.title)
    }
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})

export const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid).populate({
        path: 'rating',
        populate: {
            path: 'postedBy',
            select: 'name avatar'
        }
    })
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})

export const getAllProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    //tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    //format lại các operators cho đúng cú pháp mongo
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`)
    const restQueries = JSON.parse(queryString)
    let formatedQueries = {}
    if (queries?.color) {
        delete restQueries.color
        const colorQuery = queries.color?.split(',').map(el => ({ color: { $regex: el, $options: 'i' } }))
        formatedQueries = { $or: colorQuery }
    }

    //filtering
    if (queries?.title) restQueries.title = { $regex: queries.title, $options: 'i' } //regex tìm theo tên ko cần đầy đủ, option để viết chữ tường vẫn tìm được
    if (queries?.category) restQueries.category = { $regex: queries.category, $options: 'i' } //regex tìm theo category ko cần đầy đủ, option để viết chữ tường vẫn tìm được
    const q = { ...formatedQueries, ...restQueries }
    let queryCommand = Product.find(q)//promise bending

    //sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    //Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }

    //pagination
    //limit: số object lấy về 1 lần gọi api
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)

    //execute query
    //số lượng sp thỏa mãn điều kiện !== số lượng sp trả về 1 lần gọi api
    queryCommand.exec()
        .then(async (response) => {
            const counts = await Product.find(q).countDocuments();
            return res.status(200).json({
                success: response ? true : false,
                counts,
                products: response ? response : 'Cannot get products',
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        });

})

export const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (req.body && req.body.title) req.body.slug = slugtify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Cannot update product'
    })
})

export const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : 'Cannot delete products'
    })
})

export const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, comment, pid, updatedAt } = req.body
    if (!star || !pid) throw new Error('Mising inputs')
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.rating?.find(el => el.postedBy.toString() === _id)
    if (alreadyRating) {
        //update start and comment
        await Product.updateOne({
            _id: pid, "rating.postedBy": _id
        }, {
            $set: { 'rating.$.star': star, 'rating.$.comment': comment, 'rating.$.updatedAt': updatedAt }
        }, { new: true })
    } else {
        //add start and comment
        await Product.findByIdAndUpdate(pid, { $push: { rating: { star, comment, postedBy: _id, updatedAt } } }, { new: true })
    }

    //total rating
    const updatedProduct = await Product.findById(pid)
    const ratingCount = updatedProduct.rating.length
    const sumStarRating = updatedProduct.rating.reduce((sum, el) => sum + +el.star, 0)
    updatedProduct.totalRatings = Math.round(sumStarRating * 10 / ratingCount) / 10
    await updatedProduct.save()
    return res.status(200).json({
        status: true,
        updatedProduct
    })
})

export const uploadImagesProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if (!req.files) throw new Error('Mising inputs')
    const response = await Product.findByIdAndUpdate(pid, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true })
    return res.status(200).json({
        status: response ? true : false,
        updatedProduct: response ? response : 'Can not update image'
    })
})