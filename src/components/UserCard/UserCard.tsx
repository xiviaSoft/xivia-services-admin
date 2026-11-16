import { Stack, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import CustomDialogBox from "components/CustomDialogBox/CustomDialogBox";
import MoreVertMenu from "components/MoreVertMenu/MoreVertMenu";
import { useAuth, useToast } from "context";
import { useNavigate } from "react-router";
import { ROUTES } from "constant";
import { useState } from "react";

const UserCard = () => {
    const { logout, user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);

    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Admin";
    const initials = `${user?.firstName?.[0] ?? "A"}${user?.lastName?.[0] ?? ""}`.toUpperCase();

    const handleLogout = async () => {
        try {
            await logout();
            navigate(ROUTES.LOGIN, { replace: true });
            setShowLogout(false);
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Unable to log out.", "error");
        }
    };

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1.25}
                sx={{
                    alignSelf: { xs: "flex-end", sm: "auto" },
                    minHeight: 54,
                    pl: 1.5,
                    pr: 1,
                    border: "1px solid #E5EAF1",
                    borderRadius: "15px",
                    bgcolor: "#FFFFFF",
                    boxShadow: "0 4px 14px rgba(27, 44, 71, .035)",
                }}
            >
                <Stack spacing={0.15}>
                    <Typography sx={{ color: "#243249", fontSize: 12, fontWeight: 750, lineHeight: 1.3 }}>
                        {fullName}
                    </Typography>
                    <Typography sx={{ color: "#7A8799", fontSize: 10, textTransform: "capitalize" }}>
                        {user?.role ?? "Administrator"}
                    </Typography>
                </Stack>
                <MoreVertMenu
                    items={[{ label: "Log out", action: () => setShowLogout(true) }]}
                    isAvatar
                    avatarLabel={initials}
                />
            </Stack>

            {showLogout && (
                <CustomDialogBox
                    open={showLogout}
                    title="Log out?"
                    onClose={() => setShowLogout(false)}
                    onConfirm={handleLogout}
                    confirmText="Yes, log out"
                    icon={<Logout />}
                >
                    Are you sure you want to log out?
                </CustomDialogBox>
            )}
        </>
    );
};

export default UserCard;
