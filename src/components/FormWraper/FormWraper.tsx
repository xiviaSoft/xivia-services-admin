import { Stack } from "@mui/material";
import React from "react";

const FormWraper = ({ children }: { children: React.ReactNode }) => {
    return (
        <Stack
            sx={{
                width: "100%",
                maxWidth: 470,
                p: { xs: 2.5, sm: 4 },
                gap: 2.5,
                border: "1px solid #E6EBF2",
                borderRadius: "22px",
                bgcolor: "#FFFFFF",
                boxShadow: "0 22px 60px rgba(27, 44, 71, .10)",
            }}
        >
            {children}
        </Stack>
    );
};

export default FormWraper;
