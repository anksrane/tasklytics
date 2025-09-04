import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { getAllMasterFirebase } from "./getAllMasterService";

const getLabel=(list,value)=>list.find(item=>item.value===value)?.label || value;

export const getAllTaskFirebase = async (user, trashStatus) => {
    try {
        const tasksRef = collection(db, "tasksTable");
        const conditions = [];

        if (!trashStatus) {
            conditions.push(where("trash", "==", false));
        }    
        
        // Role-based filters
        if (user.userRole === "Manager") {
            conditions.push(where("managerId", "array-contains", user.id));
        }else if (user.userRole === "Coder") {
            conditions.push(where("coderIds", "array-contains", user.id));
        }        

        const q = conditions.length > 0 ? query(tasksRef, ...conditions) : tasksRef;      
        const querySnapshot = await getDocs(q);
        let allTasks=querySnapshot.docs.map(doc=>({
            id:doc.id,
            ...doc.data()
        })) 
        
        const [statusMaster, priorityMaster, phaseMaster, clientMaster] = await Promise.all([
            getAllMasterFirebase("statuses"),
            getAllMasterFirebase("priorities"),
            getAllMasterFirebase("phases"),
            getAllMasterFirebase("clients"),
        ]);  
        
        if (statusMaster.success && priorityMaster.success && phaseMaster.success && clientMaster.success) {
            allTasks = allTasks.map(task => ({
                ...task,
                statusLabel: getLabel(statusMaster.data, task.taskStatus),
                priorityLabel: getLabel(priorityMaster.data, task.priority),
                phaseLabel: getLabel(phaseMaster.data, task.taskPhase),
                clientLabel: getLabel(clientMaster.data, task.client),
            }));
        }        

        return {success:true, data:allTasks};
    }catch(error){
        console.log("Error fetching tasks:", error);
        return { success: false, error };
    }
}