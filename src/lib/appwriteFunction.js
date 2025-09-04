const { databases } = require("./appwrite");

export const AppwriteService = {
  listDocuments: async (database_id, collection_id, query_array_string) => {
    const docs = await databases.listDocuments(database_id, collection_id, query_array_string);
    return docs.documents || [];
  },

  getDocument: async (database_id, collection_id, document_id) => {
    const doc = await databases.getDocument(database_id, collection_id, document_id);
    return doc;
  },

  createDocument: async (database_id, collection_id, payload) => {
    const response = await databases.createDocument(
      database_id,
      collection_id,
      "unique()",
      payload
    );
    return response;
  },

  updateDocument: async (database_id, collection_id, document_id, payload) => {
    const response = await databases.updateDocument(
      database_id,
      collection_id,
      document_id,
      payload
    );
    return response;
  },

  deleteDocument: async (database_id, collection_id, document_id) => {
    const response = await databases.deleteDocument(
      database_id,
      collection_id,
      document_id,
    );
    return response;
  },

  createFile: async (bucket_id, file) => {
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

  getFilePreview: (bucket_id, file_id) => {
    return storage.getFilePreview(bucket_id, file_id);
  },

  getFileDownload: (bucket_id, file_id) => {
    return storage.getFileDownload(bucket_id, file_id);
  },

  deleteFile: async (bucket_id, file_id) => {
    try {
      const response = await storage.deleteFile(bucket_id, file_id);
      return response;
    } catch (err) {
      return { success: false, data: null };
    }
  }
}