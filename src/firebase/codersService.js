import { db } from './firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const getCodersList = async (user) => {   
    try {
        const q= query(
            collection(db, "users"),
            where("userRole", "==", "Coder")
        );
        const snapshot=await getDocs(q);

        const coders = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(coder => {
            if (user.userRole=="Admin"){
                return true;
            }else{
                return coder.manager?.includes(user.id);    
            }
        });
        // .map(coder => ({
        //     label: coder.userName,
        //     value: coder.id
        // }));          
        
        return coders;
    }catch(error){
        console.error("Error fetching coders:", error);
        return [];
    }
}