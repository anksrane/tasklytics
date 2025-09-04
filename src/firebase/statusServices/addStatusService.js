import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

// Add a new Status with sortOrder
export const addStatusFirebase = async (statusData) => {
  try {
    const statusesCol = collection(db, "statuses");

    // Fetch current statuses count
    const snapshot = await getDocs(statusesCol);
    const totalstatuses = snapshot.size; // total statuses

    const statusRef = doc(statusesCol);
    const statusId = statusRef.id;

    await setDoc(statusRef, {
      id: statusId,
      ...statusData,
      sortOrder: totalstatuses,
    });

    return { success: true, id: statusData };
  } catch (error) {
    console.error("Error adding status:", error);
    return { success: false, error };
  }
};