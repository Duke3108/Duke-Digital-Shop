import mongoose from 'mongoose'

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URL)
        if (connect.connection.readyState === 1) {
            console.log('DB connect')
        } else {
            console.log('DB connection is failed')
        }
    } catch (error) {
        console.log('DB connection is failed')
        throw new Error(error)
    }
}

export default dbConnect