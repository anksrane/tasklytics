import { db } from "../firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

export const deleteStatusFirebase = async (statusId) => {
  try {
    const statusRef = doc(db, "statuses", statusId);

    await deleteDoc(statusRef);

    return { success: true };
  } catch (error) {
    console.error("Error deleting status:", error);
    throw error;
  }
};