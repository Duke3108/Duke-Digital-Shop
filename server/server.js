import express from 'express'
import 'dotenv/config'
import dbConnect from './config/dbconnect.js'
import initRoutes from './routes/index.js'

const app = express()
const port = process.env.PORT || 8888

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dbConnect()
initRoutes(app)

app.listen(port, () => {
    console.log('Server is running on port: ' + port)
})