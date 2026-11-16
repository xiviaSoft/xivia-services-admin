import { Box, Drawer, IconButton, Stack, Typography, useMediaQuery } from "@mui/material";
import { Close, Menu as MenuIcon } from "@mui/icons-material";
import { Link, useLocation } from "react-router";
import { NAVDATA } from "constant";
import { useState } from "react";

const SIDEBAR_WIDTH = 264;

const AsideBar = () => {
    const location = useLocation();
    const isMobile = useMediaQuery("(max-width:900px)");
    const [open, setOpen] = useState(false);

    const sidebarContent = (
        <Stack
            component="aside"
            sx={{
                boxSizing: "border-box",
                width: SIDEBAR_WIDTH,
                position: isMobile ? "relative" : "fixed",
                top: 0,
                left: 0,
                height: isMobile ? "100%" : "100vh",
                minHeight: isMobile ? "100%" : "100vh",
                overflowY: "auto",
                zIndex: isMobile ? "auto" : 1200,
                px: 2,
                py: 3,
                bgcolor: "#101B30",
                color: "#E8EEF7",
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 1, mb: 5 }}>
                <Box
                    sx={{
                        width: 42,
                        height: 42,
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "14px",
                        color: "#102A36",
                        fontSize: 13,
                        fontWeight: 900,
                        letterSpacing: ".04em",
                        background: "linear-gradient(135deg, #B5F2DD, #5BC4B0)",
                    }}
                >
                    XS
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 800, letterSpacing: ".01em" }}>
                        Xivia Services
                    </Typography>
                    <Typography sx={{ color: "#91A1B8", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase" }}>
                        Admin workspace
                    </Typography>
                </Box>
                {isMobile && (
                    <IconButton
                        aria-label="Close navigation"
                        onClick={() => setOpen(false)}
                        sx={{ color: "#D8E2EF" }}
                    >
                        <Close />
                    </IconButton>
                )}
            </Stack>

            <Typography
                sx={{
                    px: 1.5,
                    mb: 1.25,
                    color: "#7F90A8",
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                }}
            >
                Workspace
            </Typography>

            <Stack component="nav" aria-label="Main navigation" spacing={0.75}>
                {NAVDATA.map((navItem) => {
                    const isActive = navItem.path === "/"
                        ? location.pathname === "/"
                        : location.pathname === navItem.path || location.pathname.startsWith(`${navItem.path}/`);
                    const Icon = navItem.icon;

                    return (
                        <Link
                            key={navItem.path}
                            to={navItem.path}
                            onClick={() => isMobile && setOpen(false)}
                            style={{ color: "inherit", textDecoration: "none" }}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                                sx={{
                                    minHeight: 46,
                                    px: 1.5,
                                    borderRadius: "12px",
                                    borderLeft: isActive ? "3px solid #85E2C3" : "3px solid transparent",
                                    color: isActive ? "#B7F0D9" : "#A8B5C8",
                                    bgcolor: isActive ? "rgba(105, 208, 177, .13)" : "transparent",
                                    transition: "background-color 160ms ease, color 160ms ease",
                                    "&:hover": {
                                        color: "#F4F7FC",
                                        bgcolor: "rgba(255,255,255,.07)",
                                    },
                                }}
                            >
                                <Icon sx={{ fontSize: 20 }} />
                                <Typography sx={{ fontSize: 13, fontWeight: isActive ? 700 : 550 }}>
                                    {navItem.title}
                                </Typography>
                            </Stack>
                        </Link>
                    );
                })}
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

            <Box
                sx={{
                    mx: 0.5,
                    px: 1.5,
                    py: 1.75,
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,.09)",
                    bgcolor: "rgba(255,255,255,.035)",
                }}
            >
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#D9E5F3" }}>
                    Admin console
                </Typography>
                <Typography sx={{ mt: 0.5, color: "#8797AE", fontSize: 11, lineHeight: 1.5 }}>
                    Manage your platform from one place.
                </Typography>
            </Box>
        </Stack>
    );

    if (isMobile) {
        return (
            <>
                <IconButton
                    aria-label="Open navigation"
                    onClick={() => setOpen(true)}
                    sx={{
                        position: "fixed",
                        top: 14,
                        left: 16,
                        zIndex: 1300,
                        width: 42,
                        height: 42,
                        color: "#F4F7FC",
                        bgcolor: "#101B30",
                        borderRadius: "13px",
                        boxShadow: "0 6px 18px rgba(16, 27, 48, .2)",
                        "&:hover": { bgcolor: "#1E3150" },
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    anchor="left"
                    open={open}
                    onClose={() => setOpen(false)}
                    PaperProps={{ sx: { width: SIDEBAR_WIDTH, bgcolor: "#101B30" } }}
                >
                    {sidebarContent}
                </Drawer>
            </>
        );
    }

    return (
        <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0 }}>
            {sidebarContent}
        </Box>
    );
};

export default AsideBar;
