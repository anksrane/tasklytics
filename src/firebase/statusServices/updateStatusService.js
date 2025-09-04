import { db } from "../firebaseConfig";
import { doc, updateDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

// Update status in Firestore
export const updateStatusFirebase = async (statusId, updatedData) => {
  try {
    const statusRef = doc(db, "statuses", statusId);

    // 1. Get current status doc to fetch old slug
    const statusSnap = await getDoc(statusRef);
    if (!statusSnap.exists()) {
      throw new Error("Status not found");
    }
    const oldSlug = statusSnap.data().value;

    // 2. Update tasks in tasksTable that reference old slug
    const tasksRef = collection(db, "tasksTable");
    const tasksSnap = await getDocs(query(tasksRef, where("taskStatus", "==", oldSlug)));

    const updatePromises = tasksSnap.docs.map((taskDoc) => {
      const taskRef = doc(db, "tasksTable", taskDoc.id);
      return updateDoc(taskRef, { taskStatus: updatedData.value });
    });
    
    await Promise.all(updatePromises);

    // Optionally, update sortOrder if needed based on total statuses
    // const statusesSnapshot = await getDocs(query(collection(db, "statuses")));
    // const sortOrder = statusesSnapshot.docs.length;
    
    await updateDoc(statusRef, {
      ...updatedData,
      // sortOrder, // uncomment if you want to recalc on update
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};