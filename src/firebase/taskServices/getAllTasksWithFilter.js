import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

const getLabel=(list,value)=>list.find(item=>item.value===value)?.label || value;

export const getAllTaskFirebase = async (
    user,
    searchTerm="",
    filters={},
    sortBy = "created_at",
    sortOrder = "desc",
    pageSize = 5,
    page = 1,
    taskPhasesList,      
    taskPrioritiesList,  
    statusesList,
    clientsList   
) => {
    try {
        const colRef= collection (db,'tasksTable');
        const conditions = [];

        if (user.userRole === "Manager") {
            conditions.push(
                where("managerId", "array-contains", user.id)
            );
        } else if (user.userRole === "Coder") {
            conditions.push(
                where("coderIds", "array-contains", user.id)
            );
        }        
    
        if(typeof filters.trash === "boolean") {
            conditions.push(where("trash", "==", filters.trash));
        }        
        if (filters.phase) {
            conditions.push(where("taskPhase", "==", filters.phase));
        }
        if (filters.status) {
            conditions.push(where("taskStatus", "==", filters.status));
        }
        if (filters.priority) {
            conditions.push(where("priority", "==", filters.priority));
        }

        let baseQuery = query(
            colRef,
            ...conditions,
            orderBy(sortBy, sortOrder)
        );   
        const querySnapshot = await getDocs(baseQuery);
        let tasks = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
            id: doc.id,
            ...data,
            taskPhaseLabel: getLabel(taskPhasesList, data.taskPhase),
            taskStatusLabel: getLabel(statusesList, data.taskStatus),
            priorityLabel: getLabel(taskPrioritiesList, data.priority),
            clientLabel: getLabel(clientsList, data.client)
            };
        });

        // --- CLIENT-SIDE SEARCH ---
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            tasks = tasks.filter(task =>
            task.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearch))
            );
        }   

        const totalTasks = tasks.length;
        const startIndex  = (page - 1) * pageSize;
        const paginatedTasks = tasks.slice(startIndex , startIndex  + pageSize);
        const hasMore = startIndex  + pageSize < totalTasks;
        console.log("startIndex",startIndex)
        
        return {
            success: true,
            data: paginatedTasks,
            total: totalTasks,
            currentPage: page,
            hasMore
        };
    }catch(error){
        console.error("Error fetching tasks:", error);
        return { success: false, error };
    }
}