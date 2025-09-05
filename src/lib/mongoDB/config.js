import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(async () => {
            console.log("Mongo conected....."); const adminDb = mongoose.connection.client.db().admin(); // <-- dùng client.db()
            const buildInfo = await adminDb.command({ buildInfo: 1 });
            console.log("MongoDB version:", buildInfo.version);
        })
        .catch(err => console.log(err))
};


const configCloudinary = cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export { connectDB, configCloudinary }

