import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoDB_URI = (process.env.BUILDENV === "dev") ? process.env.MONGODB_URL_DEV : process.env.MONGODB_URL_LIVE
    console.log(mongoDB_URI, "DB URI");
    try {
        console.log("DB Connecting...");
        const res = await mongoose.connect(mongoDB_URI);
        console.log(`MongoDB connected with server ${res.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection failed!");
        console.log(error);
    }
};
