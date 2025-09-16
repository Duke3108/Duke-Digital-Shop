import express from 'express'
import 'dotenv/config'
import dbConnect from './config/dbconnect.js'
import initRoutes from './routes/index.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const allowedOrigins = [
    process.env.URL_CLIENT || 'http://localhost:3000',
];

// CORS configuration
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

const app = express()
app.use(cors(corsOptions))
const port = process.env.PORT || 8888
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dbConnect()
initRoutes(app)

app.listen(port, () => {
    console.log('Server is running on port: ' + port)
})