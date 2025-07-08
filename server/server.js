import express from 'express'
import 'dotenv/config'
import dbConnect from './config/dbconnect.js'
import initRoutes from './routes/index.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
app.use(cors({
    origin: process.env.URL_CLIENT,
    methods: ['POST', 'PUT', 'GET', 'DELETE']
}))
const port = process.env.PORT || 8888
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dbConnect()
initRoutes(app)

app.listen(port, () => {
    console.log('Server is running on port: ' + port)
})