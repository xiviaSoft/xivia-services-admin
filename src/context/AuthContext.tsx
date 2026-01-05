import {  onAuthStateChanged,  signOut,  signInWithEmailAndPassword,  createUserWithEmailAndPassword, User as FirebaseUser 
} from "firebase/auth";
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { useQuery } from "@tanstack/react-query";
import { Admin } from "collections";
import { auth, db } from "libs";

interface AuthContextType {
  user: Admin | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  signup: (data: { email: string; password: string; fullName: string }) => Promise<void>;
}

const AuthContextData = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user data from Firestore
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", user?.uid],
    queryFn: async () => {
      if (!user) return null;
      const userRef = doc(db, "admins", user.uid);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() ? (userDoc.data() as Admin) : null;
    },
    enabled: !!user
  });

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    console.log("user logged out");
  };

  // Login
  const login = async (data: { email: string; password: string }) => {
    await signInWithEmailAndPassword(auth, data.email, data.password);
  };

  // Signup
  const signup = async (data: { email: string; password: string; fullName: string }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const firebaseUser = userCredential.user;

    //  Add user document in Firestore
    await setDoc(doc(db, "admins", firebaseUser.uid), {
      uid: firebaseUser.uid,
      email: data.email,
      fullName: data.fullName,
      role: "user", 
      createdAt: new Date(),
    });
  };

  return (
    <AuthContextData.Provider
      value={{
        user: userData ?? null,
        loading: loading || isLoading,
        logout,
        login,
        signup,
      }}
    >
      {children}
    </AuthContextData.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContextData);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
