import { db } from "../firebaseConfig";
import {
  collection,
  query,
  getDocs,
  orderBy,
  where
} from "firebase/firestore";

export const getClientsWithFilter = async ({ page, pageSize, search }) => {
  try {
    let q = collection(db, "clients");

    if (search && typeof search === "string" && search.trim() !== "") {
      q = query(q, where("keywords", "array-contains", search.toLowerCase()), orderBy("sortOrder"));
    } else {
      q = query(q, orderBy("label"));
    }

    const snapshot = await getDocs(q);
    const clients = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // server-side pagination simulation
    const startIndex = (page - 1) * pageSize;
    const paginatedData = clients.slice(startIndex, startIndex + pageSize);
    let totalPages=Math.ceil(clients.length / pageSize);

    return { success: true, data: paginatedData, totalPages:totalPages };
  } catch (error) {
    console.error("Error fetching clients:", error);
    return { data: [], total: 0 };
  }
};
