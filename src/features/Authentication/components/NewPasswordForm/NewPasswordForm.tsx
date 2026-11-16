import { Alert, Typography } from "@mui/material";
import { CustomButton, CustomPasswordField, FormWraper, PasswordCriteriaList } from "components";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { updatePassword } from "firebase/auth";
import { useToast } from "context";
import { useNavigate } from "react-router";
import { auth } from "libs";
import { useState } from "react";

interface NewPasswordType {
    newPassword: string;
    confirmPassword: string;
}

const NewPasswordForm = () => {
    const methods = useForm<NewPasswordType>({
        defaultValues: { newPassword: "", confirmPassword: "" },
    });
    const {
        handleSubmit,
        getValues,
        formState: { isSubmitting },
    } = methods;
    const password = useWatch({ control: methods.control, name: "newPassword", defaultValue: "" });
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = async ({ newPassword }: NewPasswordType) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            setErrorMessage("Sign in again before changing your password.");
            return;
        }

        setErrorMessage(null);
        try {
            await updatePassword(currentUser, newPassword);
            showToast("Password updated successfully.", "success");
            navigate("/", { replace: true });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unable to update your password.";
            setErrorMessage(message);
            showToast(message, "error");
        }
    };

    const passwordRules = {
        required: "Password is required.",
        minLength: { value: 8, message: "Password must be at least 8 characters." },
        validate: (value: string) =>
            (/[A-Z]/.test(value) &&
                /[a-z]/.test(value) &&
                /[0-9!@#$%^&*(),.?":{}|<>]/.test(value)) ||
            "Use uppercase and lowercase letters, and at least one number or symbol.",
    };

    return (
        <FormWraper>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Typography sx={{ fontSize: "32px", fontWeight: 900, textAlign: "center" }}>
                        Create Password
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: "center", marginBottom: "20px" }}>
                        You are using a temporary password, please create a permanent password below.
                    </Typography>

                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}

                    <CustomPasswordField
                        name="newPassword"
                        label="New password"
                        placeholder="New password"
                        width="100%"
                        rules={passwordRules}
                    />
                    <CustomPasswordField
                        name="confirmPassword"
                        label="Re-enter new password"
                        placeholder="Confirm password"
                        width="100%"
                        rules={{
                            required: "Please confirm your password.",
                            validate: (value: string) =>
                                value === getValues("newPassword") || "Passwords do not match.",
                        }}
                    />
                    <PasswordCriteriaList password={password} />

                    <CustomButton
                        variant="contained"
                        type="submit"
                        title={isSubmitting ? "Saving..." : "Save Password"}
                        disabled={isSubmitting}
                        fullWidth
                    />
                </form>
            </FormProvider>
        </FormWraper>
    );
};

export default NewPasswordForm;
