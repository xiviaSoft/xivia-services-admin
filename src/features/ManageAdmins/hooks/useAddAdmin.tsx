import { getApps, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth, db, firebaseConfig } from "libs";

interface NewAdminData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    phoneNumber?: string;
}

const getSecondaryAuth = () => {
    const app = getApps().find((firebaseApp) => firebaseApp.name === "Secondary")
        ?? initializeApp(firebaseConfig, "Secondary");
    return getAuth(app);
};

export const useAddAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: NewAdminData) => {
            const secondaryAuth = getSecondaryAuth();

            try {
                const credentials = await createUserWithEmailAndPassword(
                    secondaryAuth,
                    data.email.trim().toLowerCase(),
                    data.password
                );

                try {
                    await setDoc(doc(db, "admins", credentials.user.uid), {
                        adminId: credentials.user.uid,
                        firstName: data.firstName.trim(),
                        lastName: data.lastName.trim(),
                        email: data.email.trim().toLowerCase(),
                        role: data.role,
                        phoneNumber: data.phoneNumber || null,
                        createdAt: serverTimestamp(),
                        lastLogin: null,
                        isActive: true,
                        createdBy: auth.currentUser?.uid ?? null,
                    });
                } catch (error) {
                    try {
                        await credentials.user.delete();
                    } catch (cleanupError) {
                        console.error("Could not remove the incomplete Firebase account:", cleanupError);
                    }
                    throw error;
                }
            } finally {
                await secondaryAuth.signOut();
            }
        },

        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admins"] }),
    });
};
