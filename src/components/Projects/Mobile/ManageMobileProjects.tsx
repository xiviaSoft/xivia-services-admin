import {
    Box,
    Stack,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Typography,
    TableContainer,
    Paper,
    Tooltip,
    Link as MuiLink,
    useMediaQuery,
    useTheme,
    Chip,
} from "@mui/material";

import { db } from "libs"
import { useState, useEffect } from "react"
import CustomButton from "components/CustomButton/CustomButton";
import { Edit, Delete, OpenInNew, Add } from "@mui/icons-material";
import { collection, deleteDoc, doc, getDocs, addDoc, updateDoc } from "firebase/firestore"
import CustomDialogBox from "components/CustomDialogBox/CustomDialogBox";
import { FormProvider, useForm } from "react-hook-form";
import CustomTextField from "components/CustomTextField/CustomTextField";
import { uploadToCloudinary } from "services/cloudinary/cloudinary";

type AppCard = {
    id: string;
    name: string;
    description: string;
    image: string;
    tech: string[];
    live?: string;
};

export const ManageMobileProjects = () => {
    const theme = useTheme();
    const [apps, setApps] = useState<AppCard[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [editProject, setEditProject] = useState<AppCard | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    
    const methods = useForm({
        defaultValues: {
            name: "",
            description: "",
            image: "",
            tech: "",
            live: "",
        },
    });

    const fetchApps = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "apps"))
            const appsData = querySnapshot.docs.map((doc) => {
                const data = doc.data() as AppCard;
                return {
                    ...data,
                    id: doc.id,
                    tech: Array.isArray(data.tech) ? data.tech : [], 
                }
            })
            setApps(appsData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchApps()
    }, [])

    useEffect(() => {
        if (editProject) {
            methods.reset({
                name: editProject.name,
                description: editProject.description,
                image: editProject.image,
                tech: editProject.tech.join(", "),
                live: editProject.live || "",
            });
            setPreview(editProject.image);
            setImageFile(null);
        } else {
            methods.reset({
                name: "",
                description: "",
                image: "",
                tech: "",
                live: "",
            });
            setPreview("");
            setImageFile(null);
        }
    }, [editProject, methods]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleEdit = (project: AppCard) => {
        setEditProject(project);
        setOpenDialog(true);
    };

    const handleDelete = async (projectId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this project?");
        if (!confirmDelete) return;

        try {
            const projectRef = doc(db, 'apps', projectId);
            await deleteDoc(projectRef);
            await fetchApps();
        } catch (error) {
            console.log(error)
        }
    };

    const handleSubmitData = async (data: any) => {
        try {
            setLoading(true);
            const techArray = data.tech
                ? data.tech.split(",").map((t: string) => t.trim()).filter((t: string) => t)
                : [];

            let imageUrl = data.image || (editProject?.image || "");

            // Upload new image to Cloudinary if selected
            if (imageFile) {
                try {
                    imageUrl = await uploadToCloudinary(imageFile);
                } catch (error) {
                    alert(`Failed to upload image. Please try again. Error: ${error}`);
                    setLoading(false);
                    return;
                }
            }

            const payload = {
                name: data.name,
                description: data.description,
                image: imageUrl,
                tech: techArray,
                users: data.users ? parseInt(data.users) : 0,
                rating: data.rating ? parseFloat(data.rating) : 0,
                live: data.live || "",
            };

            if (editProject) {
                // UPDATE
                await updateDoc(doc(db, "apps", editProject.id), payload);
            } else {
                // ADD
                await addDoc(collection(db, "apps"), {
                    ...payload,
                    createdAt: new Date(),
                });
            }

            await fetchApps();
            setOpenDialog(false);
            setEditProject(null);
            methods.reset();
            setImageFile(null);
            setPreview("");
        } catch (error) {
            console.error("Error saving project:", error);
        } finally {
            setLoading(false);
        }
    };
    return (

        <Box>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                mb={4}
                gap={2}
            >
                <Typography variant="body2" color="text.secondary">
                    Showing {apps.length} projects
                </Typography>
                <Typography>Web Projects</Typography>
                <CustomButton
                    variant="contained"
                    title="Add New Mobile Project"
                    endIcon={<Add />}
                    onClick={() => {
                        setEditProject(null);
                        setOpenDialog(true);
                    }}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                />
            </Stack>
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    overflow: "hidden",
                    overflowX: "auto",
                }}
            >
                <Table sx={{ minWidth: 700 }}>
                    <TableHead sx={{ bgcolor: "action.hover" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Project Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Tech Stack</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {apps.map((p) => (
                            <TableRow key={p.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={{ py: 2 }}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {p.name}
                                    </Typography>
                                    {p.live && (
                                        <MuiLink
                                            href={p.live}
                                            target="_blank"
                                            rel="noopener"
                                            sx={{
                                                fontSize: "0.75rem",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                                mt: 0.5,
                                            }}
                                        >
                                            {isDesktop ? p.live : "Visit Link"} <OpenInNew sx={{ fontSize: 12 }} />
                                        </MuiLink>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" gap={0.5} flexWrap="wrap">
                                        {(Array.isArray(p.tech) && p.tech.length > 0) ? (
                                            p.tech.map((t, idx) => (
                                                <Chip key={idx} label={t} size="small" variant="outlined" />
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">No tech listed</Typography>
                                        )}
                                    </Stack>
                                </TableCell>
                               
                                <TableCell sx={{ maxWidth: 300 }}>
                                    <Tooltip title={p.description}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {p.description}
                                        </Typography>
                                    </Tooltip>
                                    {p.image && (
                                        <MuiLink
                                            href={p.image}
                                            target="_blank"
                                            rel="noopener"
                                            sx={{
                                                fontSize: "0.75rem",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                                mt: 0.5,
                                            }}
                                        >
                                            {isDesktop ? "View Image" : "Image"} <OpenInNew sx={{ fontSize: 12 }} />
                                        </MuiLink>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                        <Tooltip title="Edit">
                                            <IconButton size="small" onClick={() => handleEdit(p)} color="primary">
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" onClick={() => handleDelete(p.id)} color="error">
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <CustomDialogBox
                open={openDialog}
                onClose={() => {
                    setOpenDialog(false);
                    setEditProject(null);
                    methods.reset();
                    setImageFile(null);
                    setPreview("");
                }}
                title={editProject ? "Update Mobile Project" : "Add New Mobile Project"}
            >
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(handleSubmitData)}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                {editProject ? "Update the details of your mobile project below." : "Fill in the details of your new mobile project below."}
                            </Typography>

                            <CustomTextField
                                type="text"
                                name="name"
                                placeholder="Project Name"
                                maxLength={50}
                            />

                            <CustomTextField
                                type="text"
                                name="description"
                                placeholder="Project Description"
                                maxLength={500}
                                height="100px"
                                multiline
                            />

                            <CustomTextField
                                type="text"
                                name="tech"
                                placeholder="Technologies (comma separated: React, Firebase, etc.)"
                                maxLength={200}
                            />

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Typography sx={{ fontWeight: 500 }}>Project Image</Typography>
                                <Box
                                    component="input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    title="Upload project image"
                                    sx={{
                                        padding: "8px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        cursor: "pointer",
                                        width: '100%',
                                    }}
                                />
                                {preview && (
                                    <Box
                                        component="img"
                                        src={preview}
                                        alt="Project image preview"
                                        sx={{
                                            width: '100%',
                                            maxWidth: 200,
                                            height: 150,
                                            objectFit: "cover",
                                            borderRadius: 2,
                                            mt: 1,
                                        }}
                                    />
                                )}
                            </Box>

                            <CustomTextField
                                type="text"
                                name="live"
                                placeholder="Live URL / App Store Link"
                                maxLength={300}
                            />


                            <Stack direction="row" gap={2} sx={{ pt: 2 }}>
                                <CustomButton
                                    title={editProject ? "Update" : "Submit"}
                                    type="submit"
                                    disabled={loading}
                                    sx={{ flex: 1 }}
                                />
                                <CustomButton
                                    title="Cancel"
                                    variant="outlined"
                                    onClick={() => {
                                        setOpenDialog(false);
                                        setEditProject(null);
                                        methods.reset();
                                        setImageFile(null);
                                        setPreview("");
                                    }}
                                    sx={{ flex: 1 }}
                                />
                            </Stack>
                        </Box>
                    </form>
                </FormProvider>
            </CustomDialogBox>
        </Box>
    )
}


