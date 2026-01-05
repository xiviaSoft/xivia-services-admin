import { Box } from "@mui/material";
import AsideBar from "layout/AsideBar/AsideBar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            sx={{
                display: "flex", width: "100%", minHeight: "100vh",
            }}
        >
            {/* Sidebar */}
            <Box
                sx={{
                    width: { xs: '0', sm: "220px", md: "260px" }, flexShrink: 0, position: "sticky", top: 0, height: "100vh",
                }}>
                <AsideBar />
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    flexGrow: 1, width: "100%", px: { xs: 2, sm: 3, md: 5 }, py: 3, display: "flex", flexDirection: "column",
                }}>
                {children}
            </Box>
        </Box>
    );
};

export default AppLayout;
