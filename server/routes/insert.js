import express from 'express'
import { insertCategory, insertProduct } from '../controllers/insertData.js'


const insertRouter = express.Router()

insertRouter.post('/', insertProduct)
insertRouter.post('/cate', insertCategory)


export default insertRouter