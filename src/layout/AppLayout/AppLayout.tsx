import { Box } from "@mui/material";
import AsideBar from "layout/AsideBar/AsideBar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                minHeight: "100vh",
                bgcolor: "#F4F7FB",
            }}
        >
            <AsideBar />
            <Box
                component="main"
                sx={{
                    flex: 1,
                    minWidth: 0,
                    px: { xs: 2, sm: 3, lg: 5 },
                    pt: { xs: 8.5, md: 4 },
                    pb: { xs: 3, md: 5 },
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 1600, mx: "auto" }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default AppLayout;
