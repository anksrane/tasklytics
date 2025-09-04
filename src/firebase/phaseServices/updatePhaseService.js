import { db } from "../firebaseConfig";
import { doc, updateDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

// Update phase in Firestore
export const updatePhaseFirebase = async (phaseId, updatedData) => {
  try {
    const phaseRef = doc(db, "phases", phaseId);

    // 1. Get current phase doc to fetch old slug
    const phaseSnap = await getDoc(phaseRef);
    if (!phaseSnap.exists()) {
      throw new Error("Phase not found");
    }
    const oldSlug = phaseSnap.data().value;

    // 2. Update tasks in tasksTable that reference old slug
    const tasksRef = collection(db, "tasksTable");
    const tasksSnap = await getDocs(query(tasksRef, where("taskPhase", "==", oldSlug)));

    const updatePromises = tasksSnap.docs.map((taskDoc) => {
      const taskRef = doc(db, "tasksTable", taskDoc.id);
      return updateDoc(taskRef, { taskPhase: updatedData.value });
    });
    
    await Promise.all(updatePromises);

    // Optionally, update sortOrder if needed based on total phases
    // const phasesSnapshot = await getDocs(query(collection(db, "phases")));
    // const sortOrder = phasesSnapshot.docs.length;
    
    await updateDoc(phaseRef, {
      ...updatedData,
      // sortOrder, // uncomment if you want to recalc on update
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating phase:", error);
    throw error;
  }
};