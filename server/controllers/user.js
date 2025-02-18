import User from '../models/user.js'
import asyncHandler from 'express-async-handler'
import { generateAccessToken, generateRefreshToken } from '../middlewares/jwt.js'
import jwt from 'jsonwebtoken'
import sendMail from '../ultils/sendMail.js'
import crypto from 'crypto'

export const register = asyncHandler(async (req, res) => {
    const { email, password, name, mobile } = req.body
    if (!email || !password || !name || !mobile) {
        return res.status(400).json({
            success: false,
            mes: 'missing inputs'
        })
    }

    const user = await User.findOne({ email })
    if (user)
        throw new Error('User has existed')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? 'Register is successful' : 'something went wrong'
        })
    }
})

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            mes: 'missing inputs'
        })
    }

    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        //tach password va role
        const { password, role, refreshToken, ...userData } = response.toObject()//toObject vi object cua mongo khong phai 1 plain object

        //tao access token
        const accessToken = generateAccessToken(response._id, role)

        //tao refresh token
        const newRefreshToken = generateRefreshToken(response._id)

        //luu refresh token vao db
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })

        //luu refresh token vao cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalid credentials')
    }

})

export const getCurrentUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })
})

export const refreshAccessToken = asyncHandler(async (req, res) => {
    //lay token tu cookie
    const cookie = req.cookies
    //check token co hay ko
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookie')
    //check token hop le
    jwt.verify(cookie.refreshToken, process.env.JWT_SECRET, async (err, decode) => {
        if (err) return res.status(401).json({
            success: false,
            mes: 'Invalid refresh token'
        })
        //check token voi token luu trong db
        const response = await User.findOne({ _id: decode._id, refreshToken: cookie.refreshToken })
        return res.status(200).json({
            success: response ? true : false,
            newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token invalid'
        })
    })
})

export const logout = asyncHandler(async (req, res) => {
    //lay token tu cookie
    const cookie = req.cookies
    //check token co hay ko
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookie')
    //xoa refresh token trong db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    //xoa refresh token trong cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'logout is successful'
    })
})

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.query
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangeToken()
    await user.save()

    const html = `Xin vui long click vao link duoi day de thay doi mat khau. Link nay se het han sau 15 phut. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`

    const rs = await sendMail(email, html)
    return res.status(200).json({
        success: true,
        rs
    })
})

export const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing input')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    user.passwordChangeAt = Date.now()
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Updated password' : 'Something went wrong'
    })
})

export const getAllUsers = asyncHandler(async (req, res) => {
    const response = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        users: response
    })
})

export const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query
    if (!_id) throw new Error('Missing input')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        deleteUser: response ? `User with email ${response.email} was deleted` : 'Can not delete this user'
    })
})

export const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Something went wrong'
    })
})

export const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Something went wrong'
    })
})