import { collection, doc, getDocs, query, updateDoc, where, writeBatch,} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const updateProfileFirebase = async (cleaned) => {
  try {
    const userId = cleaned.id;
    const name = cleaned.userName;

    let updatedTaskCount = 0;

    // 1) Find all tasks where this user is in coderIds
    const tasksRef = collection(db, "tasksTable");
    const q = query(tasksRef, where("coderIds", "array-contains", userId));
    const querySnapshot = await getDocs(q);

    // Prepare batching (500 ops per batch)
    let batch = writeBatch(db);
    let opCount = 0;
    const commitBatch = async () => {
      if (opCount > 0) {
        await batch.commit();
        batch = writeBatch(db);
        opCount = 0;
      }
    };

    // 2) Update coders array for each matching task
    for (const docSnap of querySnapshot.docs) {
      const taskData = docSnap.data();
      const coders = taskData.coders || [];

      const updatedCoders = coders.map((c) =>
        c.id === userId ? { ...c, name } : c
      );

      const hasChanged =
        JSON.stringify(coders) !== JSON.stringify(updatedCoders);

      if (hasChanged) {
        const taskRef = doc(db, "tasksTable", docSnap.id);
        batch.update(taskRef, { coders: updatedCoders });
        updatedTaskCount++;
        opCount++;

        if (opCount >= 500) {
          await commitBatch();
        }
      }
    }

    await commitBatch();

    // 3) Update user doc
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      userName: cleaned.userName,
      mobileNo: cleaned.mobileNo,
      userRole: cleaned.userRole,
      manager: cleaned.manager || null,
      managers: cleaned.managers || null,
      // email: cleaned.email,   // <- If you want to sync email too
    });

    return { success: true, updatedTaskCount };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};