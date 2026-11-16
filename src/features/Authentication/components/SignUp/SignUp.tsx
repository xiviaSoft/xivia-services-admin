import { Alert, Box, Stack, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { CustomButton, CustomPasswordField, CustomTextField, FormWraper } from "components";
import { useAuth } from "context";
import { useNavigate } from "react-router";
import { ROUTES } from "constant";
import { useState } from "react";

interface SignupType {
    email: string;
    password: string;
    fullName: string;
}

const getSignupErrorMessage = (error: unknown) => {
    if (typeof error === "object" && error !== null && "code" in error) {
        const code = error.code;
        if (code === "auth/email-already-in-use") {
            return "This email is already registered.";
        }
        if (code === "auth/weak-password") {
            return "Password must be at least 8 characters and include uppercase, lowercase, and a number or symbol.";
        }
        if (code === "auth/invalid-email") {
            return "Enter a valid email address.";
        }
    }

    return error instanceof Error ? error.message : "Failed to create admin. Please try again.";
};

const SignupForm = () => {
    const methods = useForm<SignupType>({
        defaultValues: { email: "", password: "", fullName: "" },
    });
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = async (data: SignupType) => {
        setErrorMessage(null);

        try {
            await signup(data);
            navigate(ROUTES.ADMINS, { replace: true });
        } catch (error) {
            setErrorMessage(getSignupErrorMessage(error));
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                px: 2,
                py: 5,
                background:
                    "radial-gradient(circle at 12% 18%, rgba(91, 196, 176, .15), transparent 28%), radial-gradient(circle at 88% 82%, rgba(95, 140, 202, .12), transparent 30%), #F4F7FB",
            }}
        >
            <Stack spacing={2.25} sx={{ width: "100%", maxWidth: 470 }}>
                <Stack direction="row" spacing={1.4} alignItems="center" sx={{ px: 0.5 }}>
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: "14px",
                            bgcolor: "#DDF3EC",
                            color: "#176B62",
                            fontSize: 13,
                            fontWeight: 900,
                        }}
                    >
                        XS
                    </Box>
                    <Box>
                        <Typography sx={{ color: "#1E2A3D", fontSize: 15, fontWeight: 800 }}>
                            Xivia Services
                        </Typography>
                        <Typography sx={{ color: "#8491A3", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase" }}>
                            Admin workspace
                        </Typography>
                    </Box>
                </Stack>

                <FormWraper>
                    <FormProvider {...methods}>
                        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={1.5}>
                            <Box sx={{ mb: 0.5 }}>
                                <Typography component="h1" sx={{ color: "#1E2A3D", fontSize: 25, fontWeight: 800 }}>
                                    Create an account
                                </Typography>
                                <Typography sx={{ mt: 0.6, color: "#8491A3", fontSize: 13 }}>
                                    Set up your administrator profile.
                                </Typography>
                            </Box>

                            <Alert severity="info" sx={{ fontSize: 12 }}>
                                New accounts receive admin access immediately.
                            </Alert>
                            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                            <CustomTextField
                                name="fullName"
                                placeholder="Full name"
                                type="text"
                                label="Full Name"
                                width="100%"
                                maxLength={50}
                                rules={{ required: "Full name is required" }}
                            />

                            <CustomTextField
                                name="email"
                                placeholder="Enter your email address"
                                type="email"
                                label="Email"
                                width="100%"
                            />

                            <CustomPasswordField
                                name="password"
                                placeholder="At least 8 characters"
                                label="Password"
                                width="100%"
                                rules={{
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters.",
                                    },
                                    validate: (value) =>
                                        (/[A-Z]/.test(value) &&
                                            /[a-z]/.test(value) &&
                                            /[0-9!@#$%^&*(),.?":{}|<>]/.test(value)) ||
                                        "Use uppercase and lowercase letters, and at least one number or symbol.",
                                }}
                            />

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ pt: 0.75 }}>
                                <CustomButton
                                    type="submit"
                                    variant="contained"
                                    title={isSubmitting ? "Creating..." : "Create account"}
                                    fullWidth
                                    disabled={isSubmitting}
                                />
                                <CustomButton
                                    onClick={() => navigate(ROUTES.LOGIN)}
                                    title="Sign in"
                                    variant="outlined"
                                    disabled={isSubmitting}
                                />
                            </Stack>
                        </Stack>
                    </FormProvider>
                </FormWraper>
            </Stack>
        </Box>
    );
};

export default SignupForm;
