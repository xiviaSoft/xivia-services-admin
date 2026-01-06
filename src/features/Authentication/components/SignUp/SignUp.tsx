import { CustomButton, CustomTextField } from "components";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FormProvider, useForm } from "react-hook-form";
import { Stack, Typography, Alert } from "@mui/material";
import { useAuth } from "context/AuthContext";
import { useNavigate } from "react-router";
import { ROUTES } from "constant";
import { db } from "libs/firebase";
import { useState } from "react";

interface SignupType {
    email: string;
    password: string;
    fullName: string;
}

const SignupForm = () => {
    const methods = useForm<SignupType>();
    const {
        handleSubmit,
        formState: { errors },
    } = methods;

    const navigate = useNavigate();
    const { signup } = useAuth();

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const checkAdminExists = async (email: string) => {
        const adminRef = doc(db, "admins", email);
        const adminSnap = await getDoc(adminRef);
        return adminSnap.exists();
    };

    const onSubmit = async (data: SignupType) => {
        setErrorMessage(null);
        setLoading(true);

        try {
            const exists = await checkAdminExists(data.email);

            if (exists) {
                throw new Error("Admin already exists. Please login.");
            }

            // Create Firebase Auth user
            await signup({
                email: data.email,
                password: data.password,
                fullName: data.fullName,
            });

            // Create Firestore admin document
            await setDoc(doc(db, "admins", data.email), {
                fullName: data.fullName,
                email: data.email,
                role: "admin",
                status: "active",
                createdAt: new Date(),
            });

            navigate(ROUTES.ADMINS);
        } catch (error: any) {
            console.error("Admin signup failed:", error);

            if (error?.code === "auth/email-already-in-use") {
                setErrorMessage("This email is already registered.");
            } else if (error?.code === "auth/weak-password") {
                setErrorMessage("Password must be at least 6 characters.");
            } else {
                setErrorMessage("Failed to create admin. Please try again.");
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Stack minHeight="100vh" alignItems="center" justifyContent="center">
            <Stack maxWidth={360} width="100%">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography
                            sx={{
                                fontSize: "32px",
                                fontWeight: 900,
                                textAlign: "center",
                                mb: 3,
                            }}
                        >
                            Create Admin
                        </Typography>

                        {errorMessage && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {errorMessage}
                            </Alert>
                        )}

                        <CustomTextField
                            placeholder="fullName"
                            type="text"
                            label="Full Name"
                            width="100%"
                            {...methods.register("fullName", {
                                required: "Full name is required",
                            })}
                        />
                        {errors.fullName && (
                            <Typography color="error" variant="caption">
                                {errors.fullName.message}
                            </Typography>
                        )}

                        <CustomTextField
                            placeholder="password"
                            type="email"
                            label="Email"
                            width="100%"
                            {...methods.register("email", {
                                required: "Email is required",
                            })}
                        />

                        <CustomTextField
                            placeholder="password"
                            type="password"
                            label="Password"
                            width="100%"
                            {...methods.register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Minimum 6 characters",
                                },
                            })}
                        />

                        <br />

                        <CustomButton
                            type="submit"
                            variant="contained"
                            title={loading ? "Creating..." : "Create Admin"}
                            fullWidth
                            disabled={loading}
                        />
                    </form>
                </FormProvider>
            </Stack>
        </Stack>
    );
};

export default SignupForm;
