import { rtdb } from "./config";
import {
    ref,
    get,
    set,
    update,
    remove,
    push,
} from "firebase/database";

export const RealtimeService = {
    listDocuments: async (collection_id) => {
        const snapshot = await get(ref(rtdb, collection_id));
        return snapshot.exists() ? snapshot.val() : {};
    },

    getDocument: async (collection_id, document_id) => {
        const snapshot = await get(ref(rtdb, `${collection_id}/${document_id}`));
        return snapshot.exists() ? snapshot.val() : null;
    },

    createDocument: async (collection_id, payload) => {
        const newRef = push(ref(rtdb, collection_id));
        await set(newRef, payload);
        return { id: newRef.key, ...payload };
    },

    updateDocument: async (collection_id, document_id, payload) => {
        await update(ref(rtdb, `${collection_id}/${document_id}`), payload);
        return { id: document_id, ...payload };
    },

    deleteDocument: async (collection_id, document_id) => {
        await remove(ref(rtdb, `${collection_id}/${document_id}`));
        return { success: true };
    },
};
