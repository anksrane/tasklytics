import { db } from "../firebaseConfig";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

// get Prioritys List
export const getPrioritiesListFirebase = async (priorityId) => {
    try {
        const priorityRef = doc(db, "priorities", priorityId);
        // 1. Get current priority doc to fetch old slug
        const prioritySnap = await getDoc(priorityRef);
        if (!prioritySnap.exists()) {
            throw new Error("Priority not found");
        }        
        const priorityValue=prioritySnap.data().value;
        const tasksRef = collection(db, "tasksTable");
        const tasksSnap = await getDocs(query(tasksRef, where("priority", "==", priorityValue)));        
        const tasks = tasksSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, data:tasks};
    } catch (error) {
        console.error("Error updating priority:", error);
        throw error;        
    }
}