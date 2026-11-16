import { Box, Stack, Typography } from "@mui/material";
import { LoginForm } from "features/Authentication/components";

const LoginContainer = () => {
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
                <LoginForm />
                <Typography sx={{ color: "#8793A4", fontSize: 11, textAlign: "center" }}>
                    Secure workspace access
                </Typography>
            </Stack>
        </Box>
    );
};

export default LoginContainer;
