import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

// Add a new Phase with sortOrder
export const addPriorityFirebase = async (phaseData) => {
  try {
    const prioritiesCol = collection(db, "priorities");

    // Fetch current priorities count
    const snapshot = await getDocs(prioritiesCol);
    const totalpriorities = snapshot.size; // total priorities

    const phaseRef = doc(prioritiesCol);
    const phaseId = phaseRef.id;

    await setDoc(phaseRef, {
      id: phaseId,
      ...phaseData,
      sortOrder: totalpriorities,
    });

    return { success: true, id: phaseData };
  } catch (error) {
    console.error("Error adding phase:", error);
    return { success: false, error };
  }
};