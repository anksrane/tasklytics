import { db } from "./firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

export const deleteTaskFirebase = async (taskId) => {
  try {
    const taskRef = doc(db, "tasksTable", taskId);

    await deleteDoc(taskRef);

    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};