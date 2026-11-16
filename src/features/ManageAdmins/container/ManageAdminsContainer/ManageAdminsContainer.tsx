import { Alert, Box, Paper, Stack, Typography } from "@mui/material";
import {
    AdminPanelSettingsOutlined,
    CheckCircleOutline,
    SettingsOutlined,
    ShieldOutlined,
} from "@mui/icons-material";
import ManageHeaderForm from "features/ManageHeader/components/ManageHeaderForm";
import { updateDoc, doc } from "firebase/firestore";
import { CustomButton, CustomDialogBox, PageHeader } from "components";
import { AddAdmin, AdminCard } from "features/ManageAdmins/components";
import { useAddAdmin, useAdmins } from "features/ManageAdmins/hooks";
import { FormProvider, useForm } from "react-hook-form";
import { useState, type ReactNode } from "react";
import { Admin } from "collections";
import { auth, db } from "libs";
import { useToast } from "context";

export type AdminWithId = Admin & { adminId: string };

type AdminFormData = Omit<Admin, "adminId"> & { password: string };

interface AdminMetricProps {
    label: string;
    value: number | string;
    detail: string;
    icon: ReactNode;
    tint: string;
}

const AdminMetric = ({ label, value, detail, icon, tint }: AdminMetricProps) => (
    <Paper
        elevation={0}
        sx={{
            minWidth: 0,
            p: 2.25,
            border: "1px solid #E6EBF2",
            borderRadius: "17px",
            bgcolor: "#FFFFFF",
        }}
    >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography sx={{ color: "#718096", fontSize: 12, fontWeight: 650 }}>
                {label}
            </Typography>
            <Box
                sx={{
                    width: 38,
                    height: 38,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "12px",
                    bgcolor: tint,
                    color: "#176B62",
                    "& svg": { fontSize: 20 },
                }}
            >
                {icon}
            </Box>
        </Stack>
        <Typography sx={{ mt: 1.6, color: "#1C2A40", fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
            {value}
        </Typography>
        <Typography sx={{ mt: 0.9, color: "#8A96A7", fontSize: 11 }}>
            {detail}
        </Typography>
    </Paper>
);

const ManageAdminsContainer = () => {
    const methods = useForm<AdminFormData>({
        defaultValues: {
            role: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
        },
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [manageHeader, setManageHeader] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminWithId | null>(null);
    const { data: adminsData = [], isLoading, error, refetch } = useAdmins();
    const addAdmin = useAddAdmin();
    const { showToast } = useToast();
    const teamAdmins = adminsData.filter((admin) => admin.adminId !== auth.currentUser?.uid);
    const activeCount = adminsData.filter((admin) => admin.isActive !== false).length;
    const roleCount = new Set(adminsData.map((admin) => admin.role).filter(Boolean)).size;

    const handleConfirm = methods.handleSubmit(async (data) => {
        try {
            setIsSaving(true);
            if (selectedAdmin) {
                await updateDoc(doc(db, "admins", selectedAdmin.adminId), {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: data.role,
                    phoneNumber: data.phoneNumber || null,
                    updatedAt: new Date(),
                });
            } else {
                await addAdmin.mutateAsync(data);
            }

            methods.reset();
            setSelectedAdmin(null);
            setIsOpen(false);
            await refetch();
            showToast(selectedAdmin ? "Admin details updated." : "Admin added successfully.", "success");
        } catch (saveError) {
            console.error("Admin save failed:", saveError);
            showToast(
                saveError instanceof Error ? saveError.message : "Admin save failed. Please try again.",
                "error"
            );
        } finally {
            setIsSaving(false);
        }
    });

    const openAddAdmin = () => {
        setSelectedAdmin(null);
        methods.reset({
            role: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
        });
        setIsOpen(true);
    };

    const openEditAdmin = (admin: AdminWithId) => {
        setSelectedAdmin(admin);
        methods.reset({
            role: admin.role,
            firstName: admin.firstName ?? "",
            lastName: admin.lastName ?? "",
            email: admin.email ?? "",
            phoneNumber: admin.phoneNumber ?? "",
            password: "",
        });
        setIsOpen(true);
    };

    return (
        <FormProvider {...methods}>
            <PageHeader
                leftComponent="button"
                buttonTitle="Add admin"
                title="Admin management"
                subtitle="Manage your team and control workspace access."
                onClick={openAddAdmin}
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
                    gap: 2,
                    mb: 3,
                }}
            >
                <AdminMetric
                    label="Total admins"
                    value={isLoading ? "—" : adminsData.length}
                    detail="Accounts in this workspace"
                    icon={<AdminPanelSettingsOutlined />}
                    tint="#E4F5EF"
                />
                <AdminMetric
                    label="Active accounts"
                    value={isLoading ? "—" : activeCount}
                    detail="Eligible to access the dashboard"
                    icon={<CheckCircleOutline />}
                    tint="#E7F1FF"
                />
                <AdminMetric
                    label="Roles in use"
                    value={isLoading ? "—" : roleCount}
                    detail="Distinct permission groups"
                    icon={<ShieldOutlined />}
                    tint="#F3ECFF"
                />
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 2.75 },
                    border: "1px solid #E6EBF2",
                    borderRadius: "20px",
                    bgcolor: "#FFFFFF",
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    justifyContent="space-between"
                    sx={{ mb: 2.5 }}
                >
                    <Box>
                        <Typography sx={{ color: "#1E2A3D", fontSize: 17, fontWeight: 800 }}>
                            Admin team
                        </Typography>
                        <Typography sx={{ mt: 0.4, color: "#8491A3", fontSize: 12 }}>
                            {isLoading ? "Loading your team..." : `${teamAdmins.length} other team member${teamAdmins.length === 1 ? "" : "s"}`}
                        </Typography>
                    </Box>
                    <CustomButton
                        variant="outlined"
                        title="Manage site header"
                        startIcon={<SettingsOutlined />}
                        onClick={() => setManageHeader(true)}
                    />
                </Stack>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Unable to load the admin team. Please try again.
                    </Alert>
                )}

                {isLoading ? (
                    <Box sx={{ py: 6, textAlign: "center", color: "#8491A3" }}>
                        <Typography>Loading admins...</Typography>
                    </Box>
                ) : teamAdmins.length === 0 ? (
                    <Box
                        sx={{
                            minHeight: 220,
                            display: "grid",
                            placeItems: "center",
                            textAlign: "center",
                            border: "1px dashed #DCE4EC",
                            borderRadius: "15px",
                            bgcolor: "#FAFBFD",
                            px: 2,
                        }}
                    >
                        <Box>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    mx: "auto",
                                    mb: 1.5,
                                    display: "grid",
                                    placeItems: "center",
                                    borderRadius: "15px",
                                    bgcolor: "#E5F5EF",
                                    color: "#167D75",
                                }}
                            >
                                <AdminPanelSettingsOutlined />
                            </Box>
                            <Typography sx={{ color: "#26364D", fontSize: 14, fontWeight: 750 }}>
                                Your team starts here
                            </Typography>
                            <Typography sx={{ mt: 0.5, color: "#8491A3", fontSize: 12 }}>
                                Add another admin to share workspace access.
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 245px), 1fr))",
                            gap: 1.75,
                        }}
                    >
                        {teamAdmins.map((admin) => (
                            <AdminCard
                                key={admin.adminId}
                                admin={admin}
                                onEdit={() => openEditAdmin(admin)}
                                onDelete={() => void refetch()}
                            />
                        ))}
                    </Box>
                )}
            </Paper>

            <CustomDialogBox
                open={isOpen}
                title={selectedAdmin ? "Update admin" : "Add new admin"}
                onClose={() => {
                    setIsOpen(false);
                    setSelectedAdmin(null);
                }}
                onConfirm={handleConfirm}
                confirmText={isSaving ? "Saving..." : selectedAdmin ? "Save changes" : "Add admin"}
            >
                <AddAdmin mode={selectedAdmin ? "edit" : "add"} />
            </CustomDialogBox>

            <CustomDialogBox
                open={manageHeader}
                title="Manage site header"
                onClose={() => setManageHeader(false)}
                onConfirm={() => setManageHeader(false)}
                confirmText="Done"
            >
                <ManageHeaderForm />
            </CustomDialogBox>
        </FormProvider>
    );
};

export default ManageAdminsContainer;
