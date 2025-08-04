import Order from '../models/order.js'
import User from '../models/user.js'
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

export const getUserOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const queries = { ...req.query }
    //tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    //format lại các operators cho đúng cú pháp mongo
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`)
    const restQueries = JSON.parse(queryString)

    //filtering
    // let formatedQueries = {}
    // if (queries?.title) restQueries.title = { $regex: queries.title, $options: 'i' } //regex tìm theo tên ko cần đầy đủ, option để viết chữ tường vẫn tìm được
    // if (queries?.category) restQueries.category = { $regex: queries.category, $options: 'i' } //regex tìm theo category ko cần đầy đủ, option để viết chữ tường vẫn tìm được
    // if (queries?.color) {
    //     delete restQueries.color
    //     const colorQuery = queries.color?.split(',').map(el => ({ color: { $regex: el, $options: 'i' } }))
    //     formatedQueries = { $or: colorQuery }
    // }
    // if (req.query.q) {
    //     delete restQueries.q
    //     formatedQueries.$or = [
    //         { title: { $regex: req.query.q, $options: 'i' } },
    //     ]
    // }
    const q = { ...restQueries, orderBy: _id }
    let queryCommand = Order.find(q)//promise bending

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
            const counts = await Order.find(q).countDocuments();
            return res.status(200).json({
                success: response ? true : false,
                counts,
                orders: response ? response : 'Cannot get orders',
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        });
})

export const getAllOrders = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    //tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    //format lại các operators cho đúng cú pháp mongo
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`)
    const restQueries = JSON.parse(queryString)

    //filtering
    // let formatedQueries = {}
    // if (queries?.title) restQueries.title = { $regex: queries.title, $options: 'i' } //regex tìm theo tên ko cần đầy đủ, option để viết chữ tường vẫn tìm được
    // if (queries?.category) restQueries.category = { $regex: queries.category, $options: 'i' } //regex tìm theo category ko cần đầy đủ, option để viết chữ tường vẫn tìm được
    // if (queries?.color) {
    //     delete restQueries.color
    //     const colorQuery = queries.color?.split(',').map(el => ({ color: { $regex: el, $options: 'i' } }))
    //     formatedQueries = { $or: colorQuery }
    // }
    // if (req.query.q) {
    //     delete restQueries.q
    //     formatedQueries.$or = [
    //         { title: { $regex: req.query.q, $options: 'i' } },
    //     ]
    // }
    const q = { ...restQueries }
    let queryCommand = Order.find(q)//promise bending

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
            const counts = await Order.find(q).countDocuments();
            return res.status(200).json({
                success: response ? true : false,
                counts,
                orders: response ? response : 'Cannot get orders',
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        });
})
