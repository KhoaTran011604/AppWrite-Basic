import { db, storage } from "./config";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";

export const FirestoreService = {
    listDocuments: async (collection_id) => {
        const colRef = collection(db, collection_id);
        const snapshot = await getDocs(colRef);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },

    getDocument: async (collection_id, document_id) => {
        const docRef = doc(db, collection_id, document_id);
        const snapshot = await getDoc(docRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    },

    createDocument: async (collection_id, payload) => {
        const colRef = collection(db, collection_id);
        const response = await addDoc(colRef, payload);
        return { id: response.id, ...payload };
    },

    updateDocument: async (collection_id, document_id, payload) => {
        const docRef = doc(db, collection_id, document_id);
        await updateDoc(docRef, payload);
        return { id: document_id, ...payload };
    },

    deleteDocument: async (collection_id, document_id) => {
        const docRef = doc(db, collection_id, document_id);
        await deleteDoc(docRef);
        return { success: true };
    },

    uploadFile: async (file) => {
        const storageRef = ref(storage, `uploads/${file.name}-${Date.now()}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return { url, ref: storageRef.fullPath };
    },

    uploadMultiFile: async (files) => {
        return Promise.all(files.map(async (file) => {
            const storageRef = ref(storage, `uploads/${file.name}-${Date.now()}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            return { url, ref: storageRef.fullPath };
        }));
    },

    deleteFile: async (filePath) => {
        try {
            const fileRef = ref(storage, filePath);
            await deleteObject(fileRef);
            return { success: true };
        } catch {
            return { success: false };
        }
    },
};
