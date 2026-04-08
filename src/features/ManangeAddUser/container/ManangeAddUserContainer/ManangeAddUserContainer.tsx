"use client";
import { Box, Typography, Divider, Grid, Checkbox, FormControlLabel, CircularProgress, } from "@mui/material";
import { CustomButton, CustomSelect, CustomTextField, MultipulCustomSelect, } from "components";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "services/cloudinary/cloudinary";
import { useForm, FormProvider } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { MEMBER_ROLE } from "constant";
import { MemberFormData } from "types";
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
    open?: () => void;
    initialData?: any;
    id?: string;
    onSuccess?: () => void;
}

const ManangeAddUserContainer: React.FC<Props> = ({
    open,
    initialData,
    id,
    onSuccess,
}) => {
    const methods = useForm<MemberFormData>({
        defaultValues: initialData || {
            firstName: "",
            lastName: "",
            about: "",
            role: "",
            memberRole: [],
            facebook: "",
            linkedin: "",
        },
    });

    const { reset } = methods;

    const [disableSocial, setDisableSocial] = useState(false);
    const [loading, setLoading] = useState(false);

    // Image State
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    useEffect(() => {
        if (initialData) {
            setDisableSocial(!initialData.facebook && !initialData.linkedin);
        }
    }, [initialData]);

    //  Cloudinary Upload Function
    // const uploadToCloudinary = async (file: File) => {
    //     const cloudName = "dw7zmklhz";
    //     const formData = new FormData();
    //     formData.append("file", file);
    //     formData.append("upload_preset", "upload_preset");
    //     formData.append("folder", "team-member");

    //     try {
    //         const response = await fetch(
    //             `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    //             {
    //                 method: "POST",
    //                 body: formData,
    //             }
    //         );
    //         const result = await response.json();
    //         if (!response.ok) {
    //             console.error("Cloudinary error details:", result);
    //             throw new Error(`Cloudinary upload failed: ${result.error?.message || response.statusText}`);
    //         }
    //         console.log("Cloudinary Response:", result);
    //         return result.secure_url || result.url;

    //     } catch (error) {
    //         console.error("Cloudinary upload error:", error);
    //         throw error;
    //     }
    // };

    // Submit Handler
    const onSubmit = async (data: MemberFormData) => {
        try {
            setLoading(true);

            let imageUrl = initialData?.image || "";

            //  Upload Image if Selected
            if (selectedImage) {
                imageUrl = await uploadToCloudinary(selectedImage);
            }

            //  Data to Upload
            const uploadData = {
                name: `${data.firstName} ${data.lastName}`,
                description: data.about,
                role: data.role,
                memberRole: data.memberRole,

                //  Save Image URL
                image: imageUrl || "",

                socialLinks: {
                    facebook: data.facebook,
                    linkedin: data.linkedin,
                },
            };

            // Update Member
            if (id) {
                await updateDoc(doc(db, "team-member", id), uploadData);
                alert("Member updated successfully");
            }

            //  Add Member
            else {
                await addDoc(collection(db, "team-member"), uploadData);
                alert("Member added successfully");
            }

            reset();
            setSelectedImage(null);

            open?.(); // close dialog
            onSuccess?.();
        } catch (error) {
            console.error(error);
            alert("Error occurred: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <Box
                component="form"
                onSubmit={methods.handleSubmit(onSubmit)}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >

                <Section title="Personal Details" />

                <Grid container spacing={2}>
                    <Grid size={{ md: 6, xs: 12 }} >
                        <CustomTextField
                            type="text"
                            maxLength={25}
                            name="firstName"
                            label="First Name"
                            placeholder="Enter first name"
                        />
                    </Grid>

                    <Grid size={{ md: 6, xs: 12 }} >
                        <CustomTextField
                            type="text"
                            name="lastName"
                            maxLength={25}
                            label="Last Name"
                            placeholder="Enter last name"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }} >
                        <CustomTextField
                            name="about"
                            type="text"
                            label="About"
                            placeholder="Write about yourself"
                            multiline
                            minRows={2}
                        />
                    </Grid>
                </Grid>


                <Section title="Profile Image" />


                <input
                    type="file"
                    accept="image/*"
                    aria-label="Image"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setSelectedImage(e.target.files[0]);
                        }
                    }}
                />

                {/* Preview */}
                {selectedImage && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                            Selected: {selectedImage.name}
                        </Typography>

                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="preview"
                            width={120}
                            style={{
                                marginTop: "10px",
                                borderRadius: "12px",
                                objectFit: "cover",
                            }}
                        />
                    </Box>
                )}


                <Grid size={{ md: 6, xs: 12 }} >
                    <CustomSelect
                        name="role"
                        label="Role"
                        options={MEMBER_ROLE.map((m) => ({
                            label: m,
                            value: m,
                        }))}
                    />
                </Grid>

                <Grid size={{ md: 4, xs: 12 }} >
                    <MultipulCustomSelect
                        name="memberRole"
                        label="Member Role Skills"
                        options={MEMBER_ROLE.map((s) => ({
                            label: s,
                            value: s,
                        }))}
                    />
                </Grid>

                <Section title="Social Links" />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={disableSocial}
                            onChange={(e) => setDisableSocial(e.target.checked)}
                        />
                    }
                    label="Disable"
                    sx={{ ml: "auto" }}
                />

                <Grid container spacing={2}>
                    <Grid size={{ md: 6, xs: 12 }} >
                        <CustomTextField
                            type="link"
                            name="facebook"
                            label="Facebook"
                            placeholder="Facebook profile URL"
                            disabled={disableSocial}
                        />
                    </Grid>

                    <Grid size={{ md: 6, xs: 12 }} >
                        <CustomTextField
                            type="link"
                            name="linkedin"
                            label="LinkedIn"
                            placeholder="LinkedIn profile URL"
                            disabled={disableSocial}
                        />
                    </Grid>
                </Grid>


                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <CustomButton
                        title={loading ? "Submitting..." : "Submit"}
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

export default ManangeAddUserContainer;
