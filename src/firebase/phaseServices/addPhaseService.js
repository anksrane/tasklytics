import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

// Add a new Phase with sortOrder
export const addPhaseFirebase = async (phaseData) => {
  try {
    const phasesCol = collection(db, "phases");

    // Fetch current phases count
    const snapshot = await getDocs(phasesCol);
    const totalPhases = snapshot.size; // total phases

    const phaseRef = doc(phasesCol);
    const phaseId = phaseRef.id;

    await setDoc(phaseRef, {
      id: phaseId,
      ...phaseData,
      sortOrder: totalPhases,
    });

    return { success: true, id: phaseData };
  } catch (error) {
    console.error("Error adding phase:", error);
    return { success: false, error };
  }
};