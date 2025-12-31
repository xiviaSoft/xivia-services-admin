import { Box, Typography, Divider, Grid, CircularProgress, } from "@mui/material";
import { CustomButton, CustomTextField } from "components";
import { FormProvider, useForm } from "react-hook-form";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { footerFormData } from "types";
import { db } from "libs";

const Section = ({ title }: { title: string }) => (
    <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {title}
        </Typography>
        <Divider />
    </Box>
);

interface Props {
    initialData?: footerFormData;
    id: string;
    onSuccess?: () => void;
}

const ManageFooterContactContainer: React.FC<Props> = ({
    initialData,
    id,
    onSuccess,
}) => {
    const methods = useForm<footerFormData>({
        defaultValues: initialData || {
            footerPara: "",
            email: "",
            phone: "",
            address: "",
        },
    });

    const { reset, handleSubmit } = methods;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const onSubmit = async (data: footerFormData) => {
        try {
            setLoading(true);
            await updateDoc(doc(db, "contact", id), data);
            alert("Footer contact updated successfully");
            onSuccess?.();
        } catch (error) {
            console.error(error);
            alert("Failed to update footer contact");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <Section title="Footer Content" />

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <CustomTextField
                            type="text"
                            name="footerPara"
                            label="Footer Description"
                            placeholder="Footer description text"
                            multiline
                            minRows={2}
                        />
                    </Grid>
                </Grid>

                <Section title="Contact Information" />

                <Grid container spacing={2}>
                    <Grid size={{ md: 6, xs: 12 }}>
                        <CustomTextField
                            type="text"
                            name="email"
                            label="Email"
                            placeholder="Enter email"
                        />
                    </Grid>

                    <Grid size={{ md: 6, xs: 12 }}>
                        <CustomTextField
                            type="number"
                            name="phone"
                            label="Phone"
                            placeholder="Enter phone number"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <CustomTextField
                            type="text"
                            name="address"
                            label="Address"
                            placeholder="Enter address"
                            multiline
                            minRows={2}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <CustomButton
                        title={loading ? "Updating..." : "Update"}
                        type="submit"
                        disabled={loading}
                        endIcon={
                            loading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : undefined
                        }
                    />
                </Box>
            </Box>
        </FormProvider>
    );
};

export default ManageFooterContactContainer;
