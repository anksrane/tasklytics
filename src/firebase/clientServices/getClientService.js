import { db } from "../firebaseConfig";
import { doc, updateDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

// get Clients List
export const getClientsListFirebase = async (clientId) => {
    try {
        const clientRef = doc(db, "clients", clientId);
        // 1. Get current client doc to fetch old slug
        const clientSnap = await getDoc(clientRef);
        if (!clientSnap.exists()) {
            throw new Error("Client not found");
        }        
        const clientValue=clientSnap.data().value;
        const tasksRef = collection(db, "tasksTable");
        const tasksSnap = await getDocs(query(tasksRef, where("client", "==", clientValue)));        
        const tasks = tasksSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, data:tasks};
    } catch (error) {
        console.error("Error updating client:", error);
        throw error;        
    }
}