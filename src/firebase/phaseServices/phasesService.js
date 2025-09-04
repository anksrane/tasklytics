import { db } from "../firebaseConfig";
import {
  collection,
  query,
  getDocs,
  orderBy,
  where
} from "firebase/firestore";

export const getPhasesWithFilter = async ({ page, pageSize, search }) => {
  try {
    let q = collection(db, "phases");

    if (search && typeof search === "string" && search.trim() !== "") {
      q = query(q, where("keywords", "array-contains", search.toLowerCase()), orderBy("sortOrder"));
    } else {
      q = query(q, orderBy("label"));
    }

    const snapshot = await getDocs(q);
    const phases = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // server-side pagination simulation
    const startIndex = (page - 1) * pageSize;
    const paginatedData = phases.slice(startIndex, startIndex + pageSize);
    let totalPages=Math.ceil(phases.length / 10);

    return { success: true, data: paginatedData, totalPages:totalPages };
  } catch (error) {
    console.error("Error fetching phases:", error);
    return { data: [], total: 0 };
  }
};
