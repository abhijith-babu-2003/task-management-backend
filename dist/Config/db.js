import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connect = async () => {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task-management";
    try {
        await mongoose.connect(mongoUri, {
            autoIndex: process.env.NODE_ENV !== "production",
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`✅ MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};
export default connect;
//# sourceMappingURL=db.js.map