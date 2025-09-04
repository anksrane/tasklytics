import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDocs, query } from "firebase/firestore";

// Add a new client with sortOrder
export const addClientFirebase = async (clientData) => {
  try {
    const clientsCol = collection(db, "clients");

    // Fetch current clients count
    const snapshot = await getDocs(clientsCol);
    const totalClients = snapshot.size; // total clients

    const clientRef = doc(clientsCol);
    const clientId = clientRef.id;

    await setDoc(clientRef, {
      id: clientId,
      ...clientData,
      sortOrder: totalClients,
    });

    return { success: true, id: clientData };
  } catch (error) {
    console.error("Error adding client:", error);
    return { success: false, error };
  }
};