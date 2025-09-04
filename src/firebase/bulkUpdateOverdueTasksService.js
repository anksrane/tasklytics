import { db } from "./firebaseConfig";
import { collection, getDocs, writeBatch, doc, serverTimestamp } from "firebase/firestore";

export const bulkUpdateOverdueTasksFirebase = async () => {
    try {
        const tasksSnapshot = await getDocs(collection(db, "tasksTable"));
        const batch = writeBatch(db);

        const now = new Date(); // current local time
        let count = 0;

        tasksSnapshot.forEach((taskDoc) => {
            const taskData = taskDoc.data();
            
            // ensure endDate exists and is in Firestore Timestamp format
            if (taskData.endDate && taskData.endDate.toDate() < now) {
                // Only update if not already overdue
                if (taskData.taskStatus !== "overdue") {
                    const taskRef = doc(db, "tasksTable", taskDoc.id);
                    batch.update(taskRef, {
                        taskStatus: "overdue",
                        updated_at: serverTimestamp()
                    });
                    count++;
                }
            }
        });

        if (count > 0) {
            await batch.commit();
            console.log(`${count} tasks marked as overdue.`);
            return { success: true, updated: count };
        } else {
            console.log("No overdue tasks found.");
            return { success: true, updated: 0 };
        }

    } catch (error) {
        console.error("Error bulk updating tasks:", error);
        throw error;
    }
};
