import { collection, getDocs, query, orderBy, limit, startAfter, where } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Labels for Map
const taskPhases = [ { value: "planning", "label": "Planning" }, { value: "designing", "label": "Designing" }, { value: "implementation", "label": "Implementation" }, { value: "testing", "label": "Testing" }, { value: "delivery", "label": "Delivery" }, { value: "hold", "label": "Hold" } ];

const taskPriorities= [ { value: "high", "label": "High" }, { value: "medium", "label": "Medium" }, { value: "low", "label": "Low" } ];

const statuses = [ { value: "pending", "label": "Pending" }, { value: "completed", "label": "Completed" }, { value: "inProgress", "label": "In Progress" }, { value: "overdue", "label": "Overdue" } ];

const getLabel=(list,value)=>list.find(item=>item.value===value)?.label || value;

export const getAllTaskFirebase = async (
    searchTerm="",
    filters={},
    sortBy = "created_at",
    sortOrder = "asc",
    pageSize = 10,
    cursor = null,
) => {
    try {
        const colRef= collection (db,'tasksTable');


        const conditions = [];

        // Filters (phase, status, priority)
        if (filters.phase) {
            conditions.push(where("taskPhase", "==", filters.phase));
        }
        if (filters.status) {
            conditions.push(where("taskStatus", "==", filters.status));
        }
        if (filters.priority) {
            conditions.push(where("priority", "==", filters.priority));
        }
        let q = query(
            colRef,
            ...conditions,
            orderBy(sortBy, sortOrder),
            ...(cursor ? [startAfter(cursor)] : []),
            limit(pageSize)
        );

        const querySnapshot = await getDocs(q);

        const allTasks = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));    
        
        const searchFields = ["title", "client"];
        const filtered = allTasks.filter(task => {
            const lower = String(searchTerm).trim().toLowerCase();
            if (!lower) return true;

            return searchFields.some(field =>
                String(task[field] || "").toLowerCase().includes(lower)
            );
        });        

        const mapped = filtered.map(task => ({
            ...task,
            taskPhaseLabel: getLabel(taskPhases, task.taskPhase),
            taskStatusLabel: getLabel(statuses, task.taskStatus),
            priorityLabel: getLabel(taskPriorities, task.priority)
        }));

        return { success: true, data: mapped };
    }catch(error){
        console.log("Error fetching tasks:", error);
        return { success: false, error };
    }
}