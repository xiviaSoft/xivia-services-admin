import { Alert, Typography } from "@mui/material";
import { FormWraper } from "components";

const TwoFactorForm = () => {
    return (
        <FormWraper>
            <Typography sx={{ fontSize: "24px", fontWeight: 700, textAlign: "center", mb: 2 }}>
                Two-Factor Authentication
            </Typography>
            <Alert severity="info">
                Two-factor authentication is not configured for this application yet.
            </Alert>
        </FormWraper>
    );
};

export default TwoFactorForm;
