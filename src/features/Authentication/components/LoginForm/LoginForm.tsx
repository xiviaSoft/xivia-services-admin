import { Alert, Box, Stack, Typography } from "@mui/material";
import { CustomButton, CustomPasswordField, CustomTextField, FormWraper } from "components";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth, useToast } from "context";
import { Link, useLocation, useNavigate } from "react-router";
import { ROUTES } from "constant";
import { useState } from "react";

interface LoginType {
  email: string;
  password: string;
}

const getLoginErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = error.code;
    if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
      return "Incorrect email or password.";
    }
    if (code === "auth/too-many-requests") {
      return "Too many sign-in attempts. Please try again later.";
    }
  }

  return error instanceof Error ? error.message : "Unable to sign in. Please try again.";
};

const LoginForm = () => {
  const methods = useForm<LoginType>({
    defaultValues: { email: "", password: "" },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginType) => {
    setErrorMessage(null);

    try {
      await login(data);
      const state = location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null;
      const from = state?.from;
      const destination = from?.pathname
        ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
        : ROUTES.ADMINS;
      navigate(destination, { replace: true });
    } catch (error) {
      const message = getLoginErrorMessage(error);
      setErrorMessage(message);
      showToast(message, "error");
    }
  };

  return (
    <FormWraper>
      <FormProvider {...methods}>
        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={1.75}>
          <Box sx={{ mb: 0.5 }}>
            <Typography component="h1" sx={{ color: "#1E2A3D", fontSize: 26, fontWeight: 800 }}>
              Welcome back
            </Typography>
            <Typography sx={{ mt: 0.6, color: "#8491A3", fontSize: 13 }}>
              Sign in to manage your workspace.
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error">
              {errorMessage}
            </Alert>
          )}

          <CustomTextField
            type="email"
            placeholder="Enter your email address"
            name="email"
            label="Email"
            width="100%"
          />

          <CustomPasswordField
            placeholder="Enter your password"
            name="password"
            label="Password"
            width="100%"
            rules={{ required: "Password is required" }}
          />

          <CustomButton
            type="submit"
            variant="contained"
            title={isSubmitting ? "Signing in..." : "Login"}
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 0.75, minHeight: 46 }}
          />

          <Typography sx={{ pt: 0.5, color: "#8491A3", fontSize: 12, textAlign: "center" }}>
            Need an account?{" "}
            <Link
              to={ROUTES.SIGNUP}
              style={{ color: "#167D75", fontWeight: 700, textDecoration: "none" }}
            >
              Create an admin account
            </Link>
          </Typography>
        </Stack>
      </FormProvider>
    </FormWraper>
  );
};

export default LoginForm;
