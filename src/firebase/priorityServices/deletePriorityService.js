import { db } from "../firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

export const deletePriorityFirebase = async (priorityId) => {
  try {
    const priorityRef = doc(db, "priorities", priorityId);

    await deleteDoc(priorityRef);

    return { success: true };
  } catch (error) {
    console.error("Error deleting priority:", error);
    throw error;
  }
};