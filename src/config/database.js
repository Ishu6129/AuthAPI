import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
    if (!config.MONGO_URL) {
        console.error("MONGO_URL is not defined. Cannot connect to MongoDB!");
        process.exit(1);
    }

    try {
        await mongoose.connect(config.MONGO_URL)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
export default connectDB;