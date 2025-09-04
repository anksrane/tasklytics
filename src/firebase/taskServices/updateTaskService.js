import { db } from "../firebaseConfig";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export const updateTaskFirebase = async(taskId, updatedData)=>{
    try {
        const taskRef = doc(db, "tasksTable", taskId);

        await updateDoc(taskRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error("Error adding task:", error);
        throw error;
    }
};