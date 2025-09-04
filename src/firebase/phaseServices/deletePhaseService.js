import { db } from "../firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

export const deletePhaseFirebase = async (phaseId) => {
  try {
    const phaseRef = doc(db, "phases", phaseId);

    await deleteDoc(phaseRef);

    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};