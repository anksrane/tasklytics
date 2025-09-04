import { db } from "../firebaseConfig";
import { doc, updateDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";


// Update client in Firestore
export const updateClientFirebase = async (clientId, updatedData) => {
  try {
    const clientRef = doc(db, "clients", clientId);

    // 1. Get current client doc to fetch old slug
    const clientSnap = await getDoc(clientRef);
    if (!clientSnap.exists()) {
      throw new Error("Client not found");
    }
    const oldSlug = clientSnap.data().value;

    // 2. Update tasks in tasksTable that reference old slug
    const tasksRef = collection(db, "tasksTable");
    const tasksSnap = await getDocs(query(tasksRef, where("client", "==", oldSlug)));

    const updatePromises = tasksSnap.docs.map((taskDoc) => {
      const taskRef = doc(db, "tasksTable", taskDoc.id);
      return updateDoc(taskRef, { client: updatedData.value });
    });
    
    await Promise.all(updatePromises);

    // Optionally, update sortOrder if needed based on total clients
    // const clientsSnapshot = await getDocs(query(collection(db, "clients")));
    // const sortOrder = clientsSnapshot.docs.length;
    
    await updateDoc(clientRef, {
      ...updatedData,
      // sortOrder, // uncomment if you want to recalc on update
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};