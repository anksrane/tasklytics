import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getDropdownOptions = async (collectionName, columnForSort = 'label', order = 'asc') => {
    try {
        const colRef = collection(db, collectionName);
        const q = query(colRef, orderBy(columnForSort, order));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            // Basic validation for expected fields
            
            if (data && typeof data.value == 'string' && typeof data.label == 'string') {
                return {
                    value: data.value,
                    label: data.label
                };
            } else {
                console.warn(`Document ${doc.id} in collection ${collectionName} is missing 'value' or 'label' fields.`);
                return null; // Or handle as appropriate
            }
        }).filter(item => item !== null); // Remove any null entries from malformed documents
    } catch (error) {
        console.error(`Error fetching dropdown options for ${collectionName}:`, error);
        // Rethrow or return an empty array based on your error handling strategy
        throw new Error(`Failed to fetch dropdown options for ${collectionName}.`);
    }
};


export const fetchAllDropdowns = async () => {
    try {
        const [taskPhases, taskPriorities, statuses, clients] = await Promise.all([
            getDropdownOptions('phases', 'sortOrder', 'asc'), // Assuming 'sortOrder' field
            getDropdownOptions('priorities', 'sortOrder', 'asc'),
            getDropdownOptions('statuses', 'sortOrder', 'asc'),
            getDropdownOptions('clients','sortOrder','asc'),
        ]);
        // console.log("taskPhases:", taskPhases);
        // console.log("taskPriorities:", taskPriorities);
        // console.log("statuses:", statuses);
        return { taskPhases, taskPriorities, statuses, clients };
    } catch (error) {
        console.error("Error fetching all dropdown options:", error);
        // Provide default empty arrays or rethrow
        throw new Error("Failed to fetch all dropdown data.");
    }
};