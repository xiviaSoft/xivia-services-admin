import ManageHeaderForm from "features/ManageHeader/components/ManageHeaderForm";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { CustomButton, CustomDialogBox, PageHeader } from "components";
import { AddAdmin, AdminCard } from "features/ManageAdmins/components";
import { useAdmins } from "features/ManageAdmins/hooks";
import { FormProvider, useForm } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { COLORS } from "constant/color";
import { Admin } from "collections";
import { useState, useEffect } from "react";
import { auth, db } from "libs";
import { useAuth } from "context";
import { useNavigate } from "react-router";
import { ROUTES } from "constant";

export type AdminWithId = Admin & { adminId: string };

const ManageAdminsContainer = () => {
    const methods = useForm<Admin>();
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [manageHeader, setManageHeader] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminWithId | null>(null);

    const { data: adminsData = [], isLoading, refetch } = useAdmins();
    useEffect(() => {
        if (!loading && !user) {
            navigate(ROUTES.SIGNUP);
        }
    }, [user, loading, navigate]);

    const handleConfirm = methods.handleSubmit(async (data) => {
        if (!user) return;

        try {
            setIsSaving(true);

            if (selectedAdmin) {
                const adminRef = doc(db, "admins", selectedAdmin.adminId);
                await updateDoc(adminRef, {
                    ...data,
                    updatedAt: new Date(),
                });
            } else {
                const adminsRef = collection(db, "admins");

                await addDoc(adminsRef, {
                    ...data,
                    createdAt: new Date(),
                    createdBy: auth.currentUser?.uid ?? null,
                    isActive: true,
                    lastLogin: null,
                });

            }

            methods.reset();
            setSelectedAdmin(null);
            setIsOpen(false);
            refetch();
        } catch (err) {
            console.error("Admin save failed:", err);
        } finally {
            setIsSaving(false);
        }
    });

    const openAddAdmin = () => {
        setSelectedAdmin(null);
        methods.reset({
            role: undefined,
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
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
        });
        setIsOpen(true);
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <FormProvider {...methods}>
            <CustomDialogBox
                open={isOpen}
                title={selectedAdmin ? "Update Admin" : "Add New Admin"}
                onClose={() => {
                    setIsOpen(false);
                    setSelectedAdmin(null);
                }}
                onConfirm={handleConfirm}
                confirmText={
                    isSaving ? "Saving..." : selectedAdmin ? "Update" : "Add Admin"
                }
            >
                <AddAdmin mode={selectedAdmin ? "edit" : "add"} />
            </CustomDialogBox>

            <PageHeader
                leftComponent="button"
                title="Manage Admins"
                onClick={openAddAdmin}
            />

            <Box>
                <CustomButton
                    variant="outlined"
                    title="Manage Header"
                    onClick={() => setManageHeader(true)}
                />

                <CustomDialogBox
                    open={manageHeader}
                    title="Manage Header Form"
                    onClose={() => setManageHeader(false)}
                    onConfirm={() => setManageHeader(false)}
                    confirmText="Confirm"
                >
                    <ManageHeaderForm />
                </CustomDialogBox>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px", my: 2 }}>
                {isLoading ? (
                    <Typography>Loading admins...</Typography>
                ) : adminsData.length === 0 ? (
                    <Typography
                        sx={{
                            width: "100%",
                            height: "60vh",
                            display: "grid",
                            placeItems: "center",
                            fontSize: "29px",
                            color: COLORS.gray.light,
                        }}
                    >
                        No other admins
                    </Typography>
                ) : (
                    adminsData
                        .filter(a => a.adminId !== auth.currentUser?.uid)
                        .map((admin) => (
                            <AdminCard
                                key={admin.adminId}
                                admin={admin}
                                onEdit={() => openEditAdmin(admin)}
                            />
                        ))
                )}
            </Box>
        </FormProvider>
    );
};

export default ManageAdminsContainer;
