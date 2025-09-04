import { collection, getDocs, query, orderBy, limit, startAfter, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

const getLabel=(list,value)=>list.find(item=>item.value===value)?.label || value;

export const getAllTaskFirebase = async (
    user,
    searchTerm="",
    filters={},
    sortBy = "created_at",
    sortOrder = "dsc",
    pageSize = 10,
    cursor = null,
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

        // Filters (phase, status, priority)
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            conditions.push(where("keywords", "array-contains", searchTermLower));
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
        if(typeof filters.trash === "boolean") {
            conditions.push(where("trash", "==", filters.trash));
        }

        let baseQuery = query(
            colRef,
            ...conditions,
            orderBy(sortBy, sortOrder)
        );
        
        let finalQuery;
        if (cursor) {
            finalQuery = query(baseQuery, startAfter(cursor), limit(pageSize + 1));
        } else {
            finalQuery = query(baseQuery, limit(pageSize + 1));
        }        

        const querySnapshot = await getDocs(finalQuery);
        const docs = querySnapshot.docs;    // All documents fetched by Firebase (up to pageSize + 1)
        
        // Determine if there are more documents than the requested pageSize
        const hasMore = docs.length > pageSize;

        // The actual documents to return for the current page 
        const tasksToReturn = docs.slice(0, pageSize);      

        // The next cursor should be the last document snapshot of the *current page's returned data*.
        // This is crucial for the `startAfter` logic on the next fetch.
        let nextCursorToStore = null;
        if (tasksToReturn.length > 0) {
            nextCursorToStore = tasksToReturn[tasksToReturn.length - 1];
        }

        const tasks = tasksToReturn.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Apply human-readable labels
                taskPhaseLabel: getLabel(taskPhasesList, data.taskPhase),
                taskStatusLabel: getLabel(statusesList, data.taskStatus),
                priorityLabel: getLabel(taskPrioritiesList, data.priority),
                clientLabel:getLabel(clientsList,data.client)
            };
        }); 


        return {
            success: true,
            data: tasks,
            nextCursor: nextCursorToStore, // Cursor for the *next* page's query
            hasMore: hasMore // Boolean indicating if there are more pages beyond this one
        };
    }catch(error){
        console.error("Error fetching tasks:", error);
        return { success: false, error };
    }
}