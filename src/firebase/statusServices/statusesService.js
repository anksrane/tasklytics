import { db } from "../firebaseConfig";
import {
  collection,
  query,
  getDocs,
  orderBy,
  where
} from "firebase/firestore";

export const getStatusesWithFilter = async ({ page, pageSize, search }) => {
  try {
    let q = collection(db, "statuses");

    if (search && typeof search === "string" && search.trim() !== "") {
      q = query(q, where("keywords", "array-contains", search.toLowerCase()), orderBy("sortOrder"));
    } else {
      q = query(q, orderBy("label"));
    }

    const snapshot = await getDocs(q);
    const statuses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // server-side pagination simulation
    const startIndex = (page - 1) * pageSize;
    const paginatedData = statuses.slice(startIndex, startIndex + pageSize);
    let totalPages=Math.ceil(statuses.length / pageSize);

    return { success: true, data: paginatedData, totalPages:totalPages };
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return { data: [], total: 0 };
  }
};
