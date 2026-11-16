import { Avatar, Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { EmailOutlined, PhoneOutlined } from "@mui/icons-material";
import { CustomDialogBox, MoreVertMenu } from "components";
import { deleteDoc, doc } from "firebase/firestore";
import { useToast } from "context";
import { useState } from "react";
import { db } from "libs";

type AdminProps = {
    admin: {
        adminId: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        phoneNumber?: string;
        isActive?: boolean;
    };
    onEdit: () => void;
    onDelete: () => void;
};

const AdminCard = ({ admin, onEdit, onDelete }: AdminProps) => {
    const [showDelete, setShowDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { showToast } = useToast();
    const fullName = [admin.firstName, admin.lastName].filter(Boolean).join(" ") || "Admin";
    const initials = `${admin.firstName?.[0] ?? "A"}${admin.lastName?.[0] ?? ""}`.toUpperCase();
    const isActive = admin.isActive !== false;

    const handleDeleteAdmin = async () => {
        try {
            setIsDeleting(true);
            await deleteDoc(doc(db, "admins", admin.adminId));
            setShowDelete(false);
            onDelete();
            showToast("Admin removed.", "success");
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Unable to remove this admin.", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    const menuItems = [
        { label: "Edit details", action: onEdit },
        { label: "Remove admin", action: () => setShowDelete(true) },
    ];

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    minWidth: 0,
                    p: 2.5,
                    border: "1px solid #E6EBF2",
                    borderRadius: "18px",
                    bgcolor: "#FFFFFF",
                    transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                    "&:hover": {
                        transform: "translateY(-3px)",
                        borderColor: "#D5E4E7",
                        boxShadow: "0 14px 32px rgba(25, 45, 70, .08)",
                    },
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar
                        sx={{
                            width: 48,
                            height: 48,
                            bgcolor: "#DDF3EC",
                            color: "#176B62",
                            fontSize: 14,
                            fontWeight: 800,
                        }}
                    >
                        {initials}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography noWrap sx={{ color: "#1E2A3D", fontSize: 14, fontWeight: 750 }}>
                            {fullName}
                        </Typography>
                        <Typography noWrap sx={{ mt: 0.3, color: "#8491A3", fontSize: 11 }}>
                            {admin.role}
                        </Typography>
                    </Box>
                    <MoreVertMenu items={menuItems} />
                </Stack>

                <Divider sx={{ my: 2, borderColor: "#EEF1F5" }} />

                <Stack spacing={1.2}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                        <EmailOutlined sx={{ color: "#8A98AA", fontSize: 17 }} />
                        <Typography noWrap title={admin.email} sx={{ color: "#566478", fontSize: 12 }}>
                            {admin.email}
                        </Typography>
                    </Stack>
                    {admin.phoneNumber && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <PhoneOutlined sx={{ color: "#8A98AA", fontSize: 17 }} />
                            <Typography sx={{ color: "#566478", fontSize: 12 }}>
                                {admin.phoneNumber}
                            </Typography>
                        </Stack>
                    )}
                </Stack>

                <Chip
                    size="small"
                    label={isActive ? "Active" : "Inactive"}
                    sx={{
                        mt: 2.25,
                        height: 25,
                        bgcolor: isActive ? "#E5F6EF" : "#F1F3F6",
                        color: isActive ? "#25805E" : "#687588",
                        fontSize: 11,
                        fontWeight: 700,
                    }}
                />
            </Paper>

            <CustomDialogBox
                open={showDelete}
                title="Remove admin"
                onClose={() => setShowDelete(false)}
                onConfirm={handleDeleteAdmin}
                confirmText={isDeleting ? "Removing..." : "Remove admin"}
            >
                {`Remove ${fullName} from the admin team?`}
            </CustomDialogBox>
        </>
    );
};

export default AdminCard;
