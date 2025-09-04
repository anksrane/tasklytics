import { db } from "../firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

export const deleteClientFirebase = async (clientId) => {
  try {
    const clientRef = doc(db, "clients", clientId);

    await deleteDoc(clientRef);

    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};