import User from '../models/user.js'
import asyncHandler from 'express-async-handler'
import { generateAccessToken, generateRefreshToken } from '../middlewares/jwt.js'
import jwt from 'jsonwebtoken'
import sendMail from '../utils/sendMail.js'
import crypto from 'crypto'
import makeToken from 'uniqid'
import { users } from '../utils/constant.js'

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
        const token = makeToken()
        res.cookie('dataregister', { ...req.body, token }, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            sameSite: 'lax',
            secure: false
        })
        const html = `Xin vui lòng nhấn vào link dưới đây để hoàn tất quá trình đăng ký. 
    Link này se hết hạn sau 15 phút. <a href=${process.env.URL_SERVER}/api/user/finalregister/${token}>Click here</a>`

        const data = {
            email,
            html,
            subject: 'Hoàn tất đăng ký'
        }

        await sendMail(data)
        return res.json({
            success: true,
            mes: 'Kiểm tra email của bạn để hoàn tất quá trình đăng ký'
        })
    }
})

export const finalRegister = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    const { token } = req.params
    console.log(token)
    console.log(cookie)
    if (!cookie || cookie?.dataregister?.token !== token) {
        res.clearCookie('dataregister')
        return res.redirect(`${process.env.URL_CLIENT}/finalregister/failed`)
    }
    const newUser = await User.create({
        email: cookie?.dataregister?.email,
        password: cookie?.dataregister?.password,
        name: cookie?.dataregister?.name,
        mobile: cookie?.dataregister?.mobile,
    })
    res.clearCookie('dataregister')
    if (newUser) return res.redirect(`${process.env.URL_CLIENT}/finalregister/success`)
    else return res.redirect(`${process.env.URL_CLIENT}/finalregister/failed`)
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
    const user = await User.findById(_id).select('-refreshToken -password').populate({
        path: 'cart.product',
        select: 'title price thumb category'
    }).populate({
        path: 'wishlist',
        select: 'title price thumb category totalRatings'
    })
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
    const { email } = req.body
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangeToken()
    await user.save()

    const html = `Xin vui long click vao link duoi day de thay doi mat khau. 
    Link nay se het han sau 15 phut. <a href=${process.env.URL_CLIENT}/reset-password/${resetToken}>Click here</a>`

    const data = {
        email,
        html,
        subject: 'Forgot password'
    }

    const rs = await sendMail(data)
    return res.status(200).json({
        success: true,
        mes: rs ? 'Vui lòng kiểm tra email của bạn' : 'Something went wrong'
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
    const queries = { ...req.query }
    //tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])

    //format lại các operators cho đúng cú pháp mongo
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEl => `$${macthedEl}`)
    const formatedQueries = JSON.parse(queryString)

    //filtering
    if (queries?.name) formatedQueries.name = { $regex: queries.name, $options: 'i' } //regex tìm theo tên ko cần đầy đủ, option để viết chữ tường vẫn tìm được
    if (req.query.q) {
        delete formatedQueries.q
        formatedQueries.$or = [
            { email: { $regex: req.query.q, $options: 'i' } },
            { name: { $regex: req.query.q, $options: 'i' } },
            { mobile: { $regex: req.query.q, $options: 'i' } }
        ]
    }
    let queryCommand = User.find(formatedQueries)//promise bending

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
            const counts = await User.find(formatedQueries).countDocuments();
            return res.status(200).json({
                success: response ? true : false,
                counts,
                users: response ? response : 'Cannot get users',
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        });
})

export const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params
    const response = await User.findByIdAndDelete(uid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `User with email ${response.email} was deleted` : 'Can not delete this user'
    })
})

export const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { name, email, mobile, address } = req.body
    const data = { name, email, mobile, address }
    if (req.file) {
        data.avatar = req.file.path
    }
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, data, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Cập nhật người dùng thành công' : 'Something went wrong'
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

export const updateAddressUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!req.body.address) throw new Error('Missing input')
    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body } }, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Something went wrong'
    })
})

export const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, quantity, color, price, thumb } = req.body;
    if (!pid || !quantity) throw new Error('Missing inputs');
    const user = await User.findById(_id).select('cart');
    if (!user) throw new Error('User not found');
    const existingProduct = user.cart.find(el => el.product.toString() === pid && el.color === color);
    if (existingProduct) {
        // Nếu sản phẩm đã tồn tại với cùng màu, thì cộng thêm số lượng
        const response = await User.updateOne(
            { _id, "cart.product": pid, "cart.color": color },
            {
                $set: {
                    "cart.$.quantity": existingProduct.quantity + quantity
                }
            }
        );
        return res.status(200).json({
            success: response.modifiedCount > 0,
            message: response.modifiedCount > 0 ? 'Cập nhật giỏ hàng thành công' : 'Không có gì được cập nhật'
        });
    } else {
        // Nếu sản phẩm chưa có trong giỏ (hoặc khác màu), thì thêm mới
        const response = await User.findByIdAndUpdate(
            _id,
            {
                $push: {
                    cart: {
                        product: pid,
                        quantity,
                        color,
                        price,
                        thumb
                    }
                }
            },
            { new: true }
        );
        return res.status(200).json({
            success: !!response,
            message: response ? 'Thêm vào giỏ hàng thành công' : 'Đã xảy ra lỗi'
        });
    }
});

export const deleteCartItem = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, color } = req.body;
    if (!pid) {
        return res.status(400).json({ success: false, message: 'Missing inputs' });
    }
    const response = await User.findByIdAndUpdate(
        _id,
        { $pull: { cart: { product: pid, color } } },
        { new: true }
    );
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? 'Xóa sản phẩm khỏi giỏ hàng thành công' : 'Something went wrong'
    })
})

export const createUsers = asyncHandler(async (req, res) => {
    const response = await User.create(users)
    return res.status(200).json({
        success: response ? true : false,
        createdUser: response ? response : 'Cannot create user'
    })
})

export const addWishlist = asyncHandler(async (req, res) => {
    const { uid } = req.params
    const { _id } = req.user
    if (!_id || !uid) throw new Error('Missing inputs')
    const user = await User.findById(_id)
    const alreadyInWishlist = user.wishlist?.find(item => item.toString() === uid)
    if (!alreadyInWishlist) {
        const response = await User.findByIdAndUpdate(_id, { $push: { wishlist: uid } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Add to wishlist successfully' : 'Cannot add to wishlist'
        })
    }
    else {
        const response = await User.findByIdAndUpdate(_id, { $pull: { wishlist: uid } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Remove from wishlist successfully' : 'Cannot remove from wishlist'
        })
    }
})