import { CustomButton, CustomPasswordField, CustomTextField, FormWraper } from "components";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "context/AuthContext";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { ROUTES } from "constant";
import { db } from "libs/firebase";

interface SignupType {
    email: string | any;
    password: string | any;
    fullName: string;
}

const SignupForm = () => {
    const methods = useForm<SignupType>();
    const { handleSubmit, watch, formState: { errors } } = methods;
    const navigate = useNavigate();
    const { signup } = useAuth();

    const checkUserExists = async (email: string) => {
        const userRef = doc(db, "users", email);
        const userSnap = await getDoc(userRef);
        return userSnap.exists();
    };

    const onSubmit = async (data: SignupType) => {
        try {
            const exists = await checkUserExists(data.email);

            if (exists) {
                alert("User already exists. Please login.");
                navigate(ROUTES.LOGIN);
                return;
            }

            await signup({ email: data.email, password: data.password, fullName: '' });

            //  Add user data to Firestore
            await setDoc(doc(db, "users", data.email), {
                fullName: data.fullName,
                email: data.email,
                role: "user", 
                createdAt: new Date(),
            });

            alert("Signup successful! Please login.");
            navigate(ROUTES.LOGIN);
        } catch (error: any) {
            console.error("Signup failed:", error.message);
        }
    };

    return (
        <FormWraper>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Typography
                        sx={{ fontSize: "32px", fontWeight: 900, textAlign: "center", mb: 2 }}
                    >
                        Sign Up
                    </Typography>

                    <CustomTextField
                        type="text"
                        label="Full Name"
                        placeholder="Enter your full name"
                        width="100%"
                        {...methods.register("fullName", { required: "Full name is required" })}
                    />
                    {/* {errors.fullName && <p style={{ color: "red" }}>{errors.fullName.message}</p>}
                    <br /> */}

                    <CustomTextField
                        type="text"
                        label="Email"
                        placeholder="Enter your email address"
                        width="100%"
                        {...methods.register("email", {
                            required: "Email is required",
                            pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: "Invalid email format" }
                        })}
                    />
                    {/* {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
                    <br /> */}

                    <CustomTextField
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                        width="100%"
                        {...methods.register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" }
                        })}
                    />
                    {/* {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
                    <br /> */}

                    <CustomButton type="submit" variant="contained" title="Sign Up" fullWidth />
                </form>
            </FormProvider>
        </FormWraper>
    );
};

export default SignupForm;
