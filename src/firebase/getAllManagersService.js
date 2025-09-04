import { collection, getDocs, query, where, documentId } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getAllManagersFirebase = async (user) => {
  try {
    if (!user.manager || user.manager.length === 0) {
      return { success: true, data: [] };
    }
    const usersRef = collection(db, "users");
    const q = query(usersRef, where(documentId(), "in", user.manager));
    const querySnapshot = await getDocs(q);

    const managers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));  

    return { success: true, data: managers };
  } catch (error) {
    console.error("Error fetching managers:", error);
    return { success: false, error };
  }
};