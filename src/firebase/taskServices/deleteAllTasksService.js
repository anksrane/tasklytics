import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

export const deleteAllTasksService = async () => {
    try {
        // 1️⃣ Fetch all tasks
        const tasksSnapshot = await getDocs(collection(db, "tasksTable"));

        if (tasksSnapshot.empty) {
            console.log("No tasks to delete.");
        } else {
            // 2️⃣ Delete each task
            const deletePromises = tasksSnapshot.docs.map((taskDoc) =>
                deleteDoc(doc(db, "tasksTable", taskDoc.id))
            );
            await Promise.all(deletePromises);
            console.log("All tasks deleted successfully.");
        }

        // 3️⃣ Reset the serial number counter
        const counterRef = doc(db, "counters", "taskCounter");
        await setDoc(counterRef, { lastNumber: 0 }, { merge: true });
        console.log("Task serial number reset to 0.");

        return { success: true };
    } catch (error) {
        console.error("Error deleting tasks or resetting counter:", error);
        throw error;
    }
};