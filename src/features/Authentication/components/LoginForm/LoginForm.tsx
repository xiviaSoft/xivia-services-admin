import { CustomButton, CustomPasswordField, CustomTextField, FormWraper } from "components";
import { FormProvider, useForm } from "react-hook-form";
import { doc, getDoc } from "firebase/firestore"; 
import { useAuth } from "context/AuthContext";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { db } from "libs/firebase"; 
import { ROUTES } from "constant";

interface LoginType {
  email: string;
  password: string;
}

const LoginForm = () => {
  const methods = useForm<LoginType>();
  const { handleSubmit } = methods;
  const navigate = useNavigate();
  const { login } = useAuth();

  // Check if user exists in DB
  const checkUserExists = async (email: string) => {
    const userRef = doc(db, "users", email); 
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  };

  const onSubmit = async (data: LoginType): Promise<void> => {
    try {
      const user = await checkUserExists(data.email);

      if (!user) {
        navigate(ROUTES.SIGNUP);
        return;
      }

      if (user.role !== "main-admin") {
        alert("You do not have permission to access this page.");
        return;
      }

      await login(data); 
      navigate(ROUTES.ADMINS);
    } catch (error: any) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <FormWraper>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography
            sx={{
              fontSize: "32px",
              fontWeight: 900,
              textAlign: "center",
              mb: 2,
            }}
          >
            Login
          </Typography>

          <CustomTextField
            type="email"
            placeholder="Enter your email address"
            name="email"
            label="Email"
            width="100%"
          />
          <br />

          <CustomPasswordField
            placeholder="Enter your password"
            name="password"
            label="Password"
            width="100%"
          />
          <br />

          <CustomButton type="submit" variant="contained" title="Login" fullWidth />
        </form>
      </FormProvider>
    </FormWraper>
  );
};

export default LoginForm;
