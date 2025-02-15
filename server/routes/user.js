import express from 'express'
import { register, login, getCurrentUser, refreshAccessToken, logout, forgotPassword, resetPassword } from '../controllers/user.js'
import { verifyAccessToken } from '../middlewares/verifyToken.js'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/current', verifyAccessToken, getCurrentUser)
userRouter.post('/refreshtoken', refreshAccessToken)
userRouter.get('/logout', logout)
userRouter.get('/forgotpassword', forgotPassword)
userRouter.put('/resetpassword', resetPassword)
userRouter.get('/get')

export default userRouter