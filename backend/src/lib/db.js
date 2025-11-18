import mongoose from 'mongoose'
import { ENV } from './env.js'

export const mongoConnect = async () => {
    try {
        if(!ENV.MONGO_URL){
            throw new error("Envirment varible is not connect")
        }
        const connection = await mongoose.connect(ENV.MONGO_URL)
        console.log("✅ Connected to mongoDB successfully");
    } catch (error) {
        console.error("❌ Database is not connected",error)
        process.exit(1)
    }
}
