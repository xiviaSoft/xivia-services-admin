import { Box, Typography, Divider, Grid, CircularProgress } from "@mui/material";
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

// Cloudinary Upload Function
const uploadToCloudinary = async (file: File) => {
    try {

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "upload_preset");
        formData.append("folder", "gallery-images");

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/dw7zmklhz/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        const responseText = await response.text();

        // Try to parse as JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Failed to parse Cloudinary response as JSON:", parseError);
            throw new Error(`Cloudinary returned invalid response: ${responseText.substring(0, 100)}`);
        }

        console.log("Cloudinary upload successful:", result);
        return result.secure_url || result.url;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

const ManageGalleryTextContainer: React.FC<Props> = ({ id, initialData, onSuccess }) => {
    const methods = useForm<GalleryFormData>({
        defaultValues: initialData,
    });

    const { handleSubmit, reset } = methods;
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

    useEffect(() => {
        reset(initialData);
        setImagePreview(initialData?.image || null);
    }, [initialData, reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        methods.setValue('image', ''); // Clear image field in form
    };

    const onSubmit = async (data: GalleryFormData) => {
        if (!id) {
            console.error("Document ID missing");
            return;
        }

        try {
            setLoading(true);

            let imageUrl = data.image || "";

            // Upload new image if selected
            if (selectedImage) {
                imageUrl = await uploadToCloudinary(selectedImage);
            }

            const updateData = {
                ...data,
                image: imageUrl, // Update with new image URL
            };

            await updateDoc(doc(db, "gallery-text", id), updateData);

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

                <Section title="About Us Image Upload" />



                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                                Gallery Image
                            </Typography>
                            <input
                                type="file"
                                aria-label="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'block', marginBottom: '10px' }}
                            />

                            {/* Image Preview */}
                            {imagePreview && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Image Preview:
                                    </Typography>
                                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                width: '200px',
                                                height: 'auto',
                                                borderRadius: '8px',
                                                objectFit: 'cover',
                                                border: '1px solid #e0e0e0',
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            style={{
                                                position: 'absolute',
                                                top: '5px',
                                                right: '5px',
                                                background: 'rgba(0,0,0,0.7)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                            }}
                                        >
                                            ×
                                        </button>
                                    </Box>
                                </Box>
                            )}

                            {/* Current Image Display if exists */}
                            {initialData?.image && !selectedImage && !imagePreview && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Current Image:
                                    </Typography>
                                    <img
                                        src={initialData.image}
                                        alt="Current"
                                        style={{
                                            width: '200px',
                                            height: 'auto',
                                            borderRadius: '8px',
                                            objectFit: 'cover',
                                            border: '1px solid #e0e0e0',
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    {/* Hidden field to store image URL */}
                    <Grid size={{ xs: 12 }} sx={{ display: 'none' }}>
                        <CustomTextField
                            type="text"
                            name="image"
                            label="Image URL"
                            placeholder="Image URL"
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