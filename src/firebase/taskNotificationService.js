import { db } from "./firebaseConfig";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export const addTaskNotification = async({ taskId, type, message, notifiedUsers = [], serialNo = "" }) => {
    try {
        const notifRef = doc(collection(db, "taskNotificationsTable"));
        await setDoc(notifRef, {
            id: notifRef.id,
            taskId,
            type,
            message,
            notifiedUsers,
            serialNo,
            createdAt: serverTimestamp(),
            readBy: []  // later you can track which users have read
        });

        return { success: true, id: notifRef.id };
    } catch (error) {
        console.error("Error adding task notification:", error);
        throw error;
    }
};