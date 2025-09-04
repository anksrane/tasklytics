import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const getUserDataByUID=async (uid)=>{
    try {
        // users is table name.
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }else{
            return null;
        }
    } catch (error) {
        console.error("Error Fetching User Data", error);
        return null;        
    }
};