import { db } from "./firebaseConfig";
import { collection, doc, serverTimestamp, setDoc,runTransaction } from "firebase/firestore";
import { addTaskNotification } from "./taskNotificationService.js";

export const addTaskFirebase = async(taskData)=>{
    try {
        const taskRef=doc(collection(db,"tasksTable"));
        const taskId=taskRef.id;       

        // Transaction for serial number
        const serialNo = await runTransaction(db, async (transaction) => {
            const counterRef = doc(db, "counters", "taskCounter");
            const counterDoc = await transaction.get(counterRef);

            let newNumber = 1;
            if (counterDoc.exists()) {
                newNumber = counterDoc.data().lastNumber + 1;
            }

            transaction.set(counterRef, { lastNumber: newNumber }, { merge: true });

            return "T" + newNumber.toString().padStart(8, "0");
        });
        

        await setDoc(taskRef,{
            id:taskId,
            serialNo,
            ...taskData,
            keywords: [...(taskData.keywords || []), serialNo],
            created_at:serverTimestamp(),
        });

        const notifiedUsers = [
            ...taskData.coderIds,              // coders
            ...(taskData.managerId || [])      // managers
        ];    
        
        const filteredUsers = notifiedUsers.filter(uid => uid !== taskData.createdBy);
        
        await addTaskNotification({
            taskId,
            serialNo,
            type: "CREATE",
            message: `Task ${serialNo} is created`,
            notifiedUsers: filteredUsers,
        });        

        return  {success: true, id: taskId, serialNo };
    } catch (error) {
        console.error("Error adding task:", error);
        throw error;
    }
};