import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getAllMasterFirebase = async (tableName) =>{
    try {
        const mastersRef = collection(db, tableName);  
        
        const querySnapshot = await getDocs(mastersRef);
        const masterData=querySnapshot.docs.map(doc=>({
            id:doc.id,
            ...doc.data()
        }))        

        return {success:true, data:masterData};        
    } catch (error) {
        console.log("Error fetching:", error);
        return { success: false, error };        
    }
}