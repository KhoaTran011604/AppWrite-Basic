const { databases } = require("./config");

export const AppwriteService = {
  listDocuments: async (collection_id, query_array_string) => {
    const docs = await databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, collection_id, query_array_string);
    return docs.documents || [];
  },

  getDocument: async (collection_id, document_id) => {
    const doc = await databases.getDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID, collection_id, document_id);
    return doc;
  },
  // await createCollection("users", "Users", [
  //   'create("any")',
  //   'read("any")',
  //   'update("users")',  // chỉ role "users" mới update được
  //   'delete("admin")',  // chỉ role "admin" mới delete được
  // ]);
  createCollection: async (collection_id, collection_name, permissions) => {
    const response = await databases.createCollection(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      collection_id,
      collection_name,
      permissions
    );
    return response;
  },

  createDocument: async (collection_id, payload) => {
    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      collection_id,
      "unique()",
      payload
    );
    return response;
  },

  updateDocument: async (collection_id, document_id, payload) => {
    const response = await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      collection_id,
      document_id,
      payload
    );
    return response;
  },

  deleteDocument: async (collection_id, document_id) => {
    const response = await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      collection_id,
      document_id,
    );
    return response;
  },

  uploadFile: async (file) => {
    const bucket_id = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID
    if (file) {
      const uploaded = await storage.createFile(
        bucket_id,
        "unique()",
        file
      );
      return {
        uploaded,
        urlUpload: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucket_id}/files/${uploaded.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`
      };
    }
  },
  uploadMultiFile: async (files) => {
    if (!files || files.length === 0) return [];
    const bucket_id = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID
    const results = await Promise.all(
      files.map(async (file) => {
        const uploaded = await storage.createFile(
          bucket_id,
          "unique()",
          file
        );

        return {
          uploaded,
          urlUpload: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucket_id}/files/${uploaded.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`,
        };
      })
    );

    return results;
  },
  getFilePreview: (file_id) => {
    return storage.getFilePreview(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, file_id);
  },

  getFileDownload: (file_id) => {
    return storage.getFileDownload(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, file_id);
  },

  deleteFile: async (file_id) => {
    try {
      const response = await storage.deleteFile(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, file_id);
      return response;
    } catch (err) {
      return { success: false, data: null };
    }
  }
}