import app from './firebaseConfig';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(app);

export const login=(email,password) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const logout=()=>{
    return signOut(auth);
}

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};