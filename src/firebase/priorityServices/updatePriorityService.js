import { db } from "../firebaseConfig";
import { doc, updateDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

// Update priority in Firestore
export const updatePriorityFirebase = async (priorityId, updatedData) => {
  try {
    const priorityRef = doc(db, "priorities", priorityId);

    // 1. Get current priority doc to fetch old slug
    const prioritySnap = await getDoc(priorityRef);
    if (!prioritySnap.exists()) {
      throw new Error("Priority not found");
    }
    const oldSlug = prioritySnap.data().value;

    // 2. Update tasks in tasksTable that reference old slug
    const tasksRef = collection(db, "tasksTable");
    const tasksSnap = await getDocs(query(tasksRef, where("priority", "==", oldSlug)));

    const updatePromises = tasksSnap.docs.map((taskDoc) => {
      const taskRef = doc(db, "tasksTable", taskDoc.id);
      return updateDoc(taskRef, { priority: updatedData.value });
    });
    
    await Promise.all(updatePromises);

    // Optionally, update sortOrder if needed based on total priorities
    // const prioritiesSnapshot = await getDocs(query(collection(db, "priorities")));
    // const sortOrder = prioritiesSnapshot.docs.length;
    
    await updateDoc(priorityRef, {
      ...updatedData,
      // sortOrder, // uncomment if you want to recalc on update
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating priority:", error);
    throw error;
  }
};