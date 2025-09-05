import mongoose from "mongoose";
import { configCloudinary, connectDB } from "./config";


// Kết nối MongoDB 
connectDB()

export const MongoService = {
    // ✅ Lấy tất cả document
    listDocuments: async (collection_id, query) => {
        const Model = mongoose.connection.model(collection_id);
        const docs = await Model.find(query).lean();
        return docs;
    },

    // ✅ Lấy 1 document
    getDocument: async (collection_id, document_id) => {
        const Model = mongoose.connection.model(collection_id);
        const doc = await Model.findById(document_id).lean();
        return doc;
    },

    // ✅ Tạo schema/collection (runtime)
    createCollection: async (collection_id, schemaDef) => {
        const schema = new mongoose.Schema(schemaDef, { timestamps: true });
        const Model = mongoose.model(collection_id, schema);
        return Model;
    },

    // ✅ Tạo document
    createDocument: async (collection_id, payload) => {
        const Model = mongoose.connection.model(collection_id);
        const doc = new Model(payload);
        await doc.save();
        return doc.toObject();
    },

    // ✅ Update document
    updateDocument: async (collection_id, document_id, payload) => {
        const Model = mongoose.connection.model(collection_id);
        const doc = await Model.findByIdAndUpdate(document_id, payload, { new: true }).lean();
        return doc;
    },

    // ✅ Xoá document
    deleteDocument: async (collection_id, document_id) => {
        const Model = mongoose.connection.model(collection_id);
        await Model.findByIdAndDelete(document_id);
        return { success: true };
    },

    // ✅ Upload 1 file lên Cloudinary
    uploadFile: async (filePath, folder = "uploads") => {
        const uploaded = await configCloudinary.uploader.upload(filePath, {
            folder,
            resource_type: "auto",
        });
        return {
            public_id: uploaded.public_id,
            url: uploaded.secure_url,
        };
    },

    // ✅ Upload nhiều file
    uploadMultiFile: async (files, folder = "uploads") => {
        return Promise.all(files.map((f) => MongoService.uploadFile(f, folder)));
    },

    // ✅ Xoá file trên Cloudinary
    deleteFile: async (keyToDelete) => {
        try {
            await configCloudinary.uploader.destroy(keyToDelete);
            return { success: true };
        } catch {
            return { success: false };
        }
    },
    uploadMediaFn: async (files) => {
        let uploadResults = [];
        var result = null
        for (const file of files) {
            if (file.mimetype !== 'video/mp4') {
                result = await configCloudinary.uploader.upload(file.path, {
                    folder: "my_upload",//"uploads", // Thư mục trên Cloudinary
                    quality: "auto",
                });
                result.isVideo = false
            } else {
                result = await uploadLargeAsync(file.path, {
                    folder: "my_upload",
                    quality: "auto",
                    resource_type: "video",
                    chunk_size: 6000000,
                });
                result.isVideo = true;
            }


            if (result)
                uploadResults.push(result);
            fs.unlinkSync(file.path);
        }

        var dataImages = uploadResults?.length > 0 ? uploadResults.map((item, index) => ({
            imageAbsolutePath: item.secure_url,
            fileName: `${item.original_filename}.${item.format}`,
            keyToDelete: item.public_id,
            imageBase64String: "",
            imageFile: null,
            isNewUpload: false,
            displayPost: index,
            isVideo: item.isVideo
        })) : []
        return dataImages
    }

};


const uploadLargeAsync = (filePath, options) => {
    return new Promise((resolve, reject) => {
        configCloudinary.uploader.upload_large(filePath, options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
};
