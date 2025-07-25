import express from 'express'
import { register, login, getCurrentUser, refreshAccessToken, logout, forgotPassword, resetPassword, getAllUsers, deleteUser, updateUser, updateUserByAdmin, updateAddressUser, updateCart, finalRegister } from '../controllers/user.js'
import { isAdmin, verifyAccessToken } from '../middlewares/verifyToken.js'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.get('/finalregister/:token', finalRegister)
userRouter.post('/login', login)
userRouter.get('/current', verifyAccessToken, getCurrentUser)
userRouter.post('/refreshtoken', refreshAccessToken)
userRouter.get('/logout', logout)
userRouter.post('/forgotpassword', forgotPassword)
userRouter.put('/resetpassword', resetPassword)
userRouter.get('/', [verifyAccessToken, isAdmin], getAllUsers)
userRouter.delete('/', [verifyAccessToken, isAdmin], deleteUser)
userRouter.put('/current', verifyAccessToken, updateUser)
userRouter.put('/cart', [verifyAccessToken], updateCart)
userRouter.put('/address', [verifyAccessToken], updateAddressUser)
userRouter.put('/:uid', [verifyAccessToken, isAdmin], updateUserByAdmin)

export default userRouter