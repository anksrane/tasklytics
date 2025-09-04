import { db } from "../firebaseConfig";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

// get Phases List
export const getPhasesListFirebase = async (phaseId) => {
    try {
        const phaseRef = doc(db, "phases", phaseId);
        // 1. Get current phase doc to fetch old slug
        const phaseSnap = await getDoc(phaseRef);
        if (!phaseSnap.exists()) {
            throw new Error("Phase not found");
        }        
        const phaseValue=phaseSnap.data().value;
        const tasksRef = collection(db, "tasksTable");
        const tasksSnap = await getDocs(query(tasksRef, where("taskPhase", "==", phaseValue)));        
        const tasks = tasksSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, data:tasks};
    } catch (error) {
        console.error("Error updating phase:", error);
        throw error;        
    }
}