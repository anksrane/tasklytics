import { db } from "../firebaseConfig";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

// get Status List
export const getStatusListFirebase = async (statusId) => {
    try {
        const statusRef = doc(db, "statuses", statusId);
        // 1. Get current status doc to fetch old slug
        const statusSnap = await getDoc(statusRef);
        if (!statusSnap.exists()) {
            throw new Error("Status not found");
        }        
        const statusValue=statusSnap.data().value;
        const tasksRef = collection(db, "tasksTable");
        const tasksSnap = await getDocs(query(tasksRef, where("taskStatus", "==", statusValue)));        
        const tasks = tasksSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, data:tasks};
    } catch (error) {
        console.error("Error updating status:", error);
        throw error;        
    }
}