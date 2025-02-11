import User from '../models/user.js'
import asyncHandler from 'express-async-handler'

export const register = asyncHandler(async (req, res) => {
    const { email, password, name, mobile } = req.body
    if (!email || !password || !name || !mobile) {
        return res.status(400).json({
            success: false,
            mes: 'missing inputs'
        })
    }
    const response = await User.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        response
    })
})

