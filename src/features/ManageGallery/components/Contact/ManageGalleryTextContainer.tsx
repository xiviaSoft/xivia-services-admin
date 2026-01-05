import { Box, Typography, Divider, Grid, CircularProgress, } from "@mui/material";
import { CustomButton, CustomTextField } from "components";
import { FormProvider, useForm } from "react-hook-form";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { GalleryFormData } from "types";
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
    id: string;
    initialData: GalleryFormData;
    onSuccess?: () => void;
}

const ManageGalleryTextContainer: React.FC<Props> = ({ id, initialData, onSuccess, }) => {
    const methods = useForm<GalleryFormData>({
        defaultValues: initialData,
    });

    const { handleSubmit, reset } = methods;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    const onSubmit = async (data: GalleryFormData) => {
        if (!id) {
            console.error("Document ID missing");
            return;
        }

        try {
            setLoading(true);

            await updateDoc(doc(db, "gallery-text", id), {
                ...data,
            });

            alert("Gallery content updated successfully");
            onSuccess?.();
        } catch (error) {
            console.error(error);
            alert("Failed to update gallery content");
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
                <Section title="Portfolio Section" />

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <CustomTextField
                            type="text"
                            name="title"
                            label="Main Title"
                            placeholder="Enter portfolio title"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <CustomTextField
                            type="text"
                            name="description"
                            label="Main Description"
                            placeholder="Enter portfolio description"
                            multiline
                            minRows={3}
                        />
                    </Grid>
                </Grid>

                <Section title="About Us Section" />

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <CustomTextField
                            type="text"
                            name="aboutUsTitle"
                            label="About Us Title"
                            placeholder="Enter About Us title"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <CustomTextField
                            type="text"
                            name="aboutUsDescription"
                            label="About Us Description"
                            placeholder="Enter About Us description"
                            multiline
                            minRows={3}
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

export default ManageGalleryTextContainer;
