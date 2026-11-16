import { Alert, LinearProgress } from "@mui/material";
import { ROUTES } from "constant";
import { useAuth } from "context";
import { Navigate, Outlet, useLocation } from "react-router";

const NormalRoutes = () => {
    const { user, loading, error } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LinearProgress />;
    }

    if (error) {
        return (
            <Alert severity="error">
                Unable to verify your admin account. Please refresh the page and try again.
            </Alert>
        );
    }

    return user ? (
        <Navigate to={ROUTES.ADMINS} state={{ from: location }} replace />
    ) : (
        <Outlet />
    );
};

export default NormalRoutes;
