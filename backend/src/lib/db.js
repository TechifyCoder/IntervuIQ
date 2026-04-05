import mongoose from 'mongoose'
import { ENV } from './env.js'

export const mongoConnect = async () => {
    try {
        if (!ENV.MONGO_URL) {
            throw new Error("MONGO_URL environment variable is not defined");
        }
        
        // If the connection is already established, reuse it.
        if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
            console.log("✅ Reusing existing mongoDB connection");
            return;
        }

        const connection = await mongoose.connect(ENV.MONGO_URL);
        console.log("✅ Connected to mongoDB successfully", connection.connection.host);
    } catch (error) {
        console.error("❌ Database is not connected", error);
        // Do not use process.exit(1) in a serverless function, let the error propagate.
        if (ENV.NODE_ENV !== "production") {
            process.exit(1);
        }
        throw error;
    }
}
