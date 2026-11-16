import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ReactNode, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Admin } from "collections";
import { auth, db } from "libs";
import { AuthContextData } from "./AuthContextData";

const ADMIN_ROLES = new Set([
  "admin",
  "main-admin",
  "super_admin",
  "superadmin",
  "moderator",
  "support",
  "editor",
]);

const getAdminProfile = async (uid: string): Promise<Admin | null> => {
  const adminRef = doc(db, "admins", uid);
  const adminSnapshot = await getDoc(adminRef);

  if (!adminSnapshot.exists()) {
    return null;
  }

  const profile = adminSnapshot.data() as Admin & { status?: string };
  if (
    profile.isActive === false ||
    profile.status === "inactive" ||
    !ADMIN_ROLES.has(profile.role)
  ) {
    return null;
  }

  return { ...profile, adminId: adminSnapshot.id };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authStateError, setAuthStateError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      (currentUser) => {
        setFirebaseUser(currentUser);
        setAuthStateError(null);
        setAuthLoading(false);
      },
      (error) => {
        setAuthStateError(error);
        setAuthLoading(false);
      }
    );
  }, []);

  const adminQuery = useQuery({
    queryKey: ["admin", firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser) return null;
      return getAdminProfile(firebaseUser.uid);
    },
    enabled: !!firebaseUser,
  });

  const login = async (data: { email: string; password: string }) => {
    const credentials = await signInWithEmailAndPassword(
      auth,
      data.email.trim().toLowerCase(),
      data.password
    );

    try {
      const profile = await queryClient.fetchQuery({
        queryKey: ["admin", credentials.user.uid],
        queryFn: () => getAdminProfile(credentials.user.uid),
      });

      if (!profile) {
        throw new Error("No active admin profile is associated with this account.");
      }
    } catch (error) {
      await signOut(auth);
      throw error;
    }
  };

  const signup = async (data: { email: string; password: string; fullName: string }) => {
    const fullName = data.fullName.trim();
    if (!fullName) {
      throw new Error("Full name is required.");
    }

    const credentials = await createUserWithEmailAndPassword(
      auth,
      data.email.trim().toLowerCase(),
      data.password
    );
    const [firstName, ...lastNameParts] = fullName.split(/\s+/);
    const email = data.email.trim().toLowerCase();
    const queryKey = ["admin", credentials.user.uid];
    const profile: Admin = {
      adminId: credentials.user.uid,
      email,
      firstName,
      lastName: lastNameParts.join(" "),
      role: "admin",
      isActive: true,
      createdAt: new Date(),
      createdBy: null,
      lastLogin: new Date(),
    };

    try {
      await setDoc(doc(db, "admins", credentials.user.uid), {
        ...profile,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    } catch (error) {
      try {
        await deleteUser(credentials.user);
      } catch (cleanupError) {
        console.error("Could not remove the incomplete Firebase account:", cleanupError);
      }
      throw error;
    }

    await queryClient.cancelQueries({ queryKey });
    queryClient.setQueryData(queryKey, profile);
  };

  const logout = async () => {
    await signOut(auth);
    queryClient.removeQueries({ queryKey: ["admin"] });
  };

  return (
    <AuthContextData.Provider
      value={{
        user: adminQuery.data ?? null,
        loading: authLoading || (!!firebaseUser && adminQuery.isLoading),
        error: authStateError ?? (adminQuery.error instanceof Error ? adminQuery.error : null),
        logout,
        login,
        signup,
      }}
    >
      {children}
    </AuthContextData.Provider>
  );
};
