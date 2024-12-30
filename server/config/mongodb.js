import mongoose from 'mongoose'
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/ecommerce`)
        mongoose.connection.on('Connected', () => {
            console.log('Connected to MongoDB')
        })

    } catch (error) {
        console.error('MongoDB connection Error', error)
    }
}
export default connectDB;