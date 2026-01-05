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
    useMediaQuery,
    useTheme,
    Divider,
    Paper,
    Tooltip,
    Link as MuiLink,
} from "@mui/material";
import { Add, Delete, Edit, OpenInNew } from "@mui/icons-material";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { CustomButton, CustomDialogBox, PageHeader } from "components";
import { AddProjectForm } from "screens";
import { db } from "libs";

interface Project {
    id: string;
    title: string;
    client: string;
    category: string;
    description: string;
    link: string;
    Image: string;
}

const ManageProjectContainer = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null);

    const theme = useTheme();

    // Responsive breakpoints
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const snap = await getDocs(collection(db, "gallery"));
            setProjects(
                snap.docs.map((d) => ({
                    id: d.id,
                    ...(d.data() as Omit<Project, "id">),
                }))
            );
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            await deleteDoc(doc(db, "gallery", id));
            fetchProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    const handleEdit = (project: Project) => {
        setEditProject(project);
        setOpenDialog(true);
    };

    return (
        <Box
            sx={{
                maxWidth: "1400px",
                py: { xs: 2, sm: 3 },
            }}
        >
            <PageHeader title="Manage Projects" />

            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                mb={4}
                gap={2}
            >
                <Typography variant="body2" color="text.secondary">
                    Showing {projects.length} projects
                </Typography>
                <CustomButton
                    variant="contained"
                    title="Add New Project"
                    endIcon={<Add />}
                    onClick={() => {
                        setEditProject(null);
                        setOpenDialog(true);
                    }}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                />
            </Stack>

            {loading ? (
                <Box sx={{ textAlign: "center", py: 5 }}>
                    <Typography color="text.secondary">Loading projects...</Typography>
                </Box>
            ) : projects.length === 0 ? (
                <Paper sx={{ p: 5, textAlign: "center", bgcolor: "background.default" }}>
                    <Typography color="text.secondary">No projects found.</Typography>
                </Paper>
            ) : isMobile ? (
                /* Mobile View: Card-based layout */
                <Stack spacing={2}>
                    {projects.map((p) => (
                        <Paper
                            key={p.id}
                            elevation={1}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700} color="primary">
                                        {p.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                                        {p.category} • {p.client}
                                    </Typography>
                                </Box>
                                <Stack direction="row" spacing={0.5}>
                                    <IconButton size="small" onClick={() => handleEdit(p)} color="primary">
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(p.id)} color="error">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Stack>

                            <Divider sx={{ my: 1.5 }} />

                            <Stack>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 2,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        color: "text.secondary",
                                    }}
                                >
                                    {p.description}
                                </Typography>
                                {p.Image && (
                                    <MuiLink
                                        href={p.Image}
                                        target="_blank"
                                        rel="noopener"
                                        sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            fontSize: "0.8125rem",
                                            textDecoration: "none",
                                        }}
                                    >
                                        Background Image <OpenInNew sx={{ fontSize: 14 }} />
                                    </MuiLink>
                                )}
                            </Stack>

                            {p.link && (
                                <MuiLink
                                    href={p.link}
                                    target="_blank"
                                    rel="noopener"
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        fontSize: "0.8125rem",
                                        textDecoration: "none",
                                    }}
                                >
                                    View Project <OpenInNew sx={{ fontSize: 14 }} />
                                </MuiLink>
                            )}
                        </Paper>
                    ))}
                </Stack>
            ) : (
                /* Tablet & Desktop View: Enhanced Table layout */
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    <Table sx={{ minWidth: isTablet ? 700 : 1000 }}>
                        <TableHead sx={{ bgcolor: "action.hover" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Project Details</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Client</TableCell>
                                {!isTablet && <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>}
                                <TableCell sx={{ fontWeight: 700 }}>Description & Image</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {projects.map((p) => (
                                <TableRow key={p.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ py: 2 }}>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {p.title}
                                        </Typography>
                                        {p.link && (
                                            <MuiLink
                                                href={p.link}
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
                                                {isDesktop ? p.link : "Visit Link"} <OpenInNew sx={{ fontSize: 12 }} />
                                            </MuiLink>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{p.client}</Typography>
                                    </TableCell>
                                    {!isTablet && (
                                        <TableCell>
                                            <Typography variant="body2" sx={{ bgcolor: 'action.selected', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block' }}>
                                                {p.category}
                                            </Typography>
                                        </TableCell>
                                    )}
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
                                        {p.Image && (
                                            <MuiLink
                                                href={p.Image}
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
                                                {isDesktop ? p.Image : "Visit Link"} <OpenInNew sx={{ fontSize: 12 }} />
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
            )}

            <CustomDialogBox
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                title={editProject ? "Update Project" : "Add Project"}            >
                <AddProjectForm
                    project={editProject}
                    onClose={() => {
                        setOpenDialog(false);
                        fetchProjects();
                    }}
                />
            </CustomDialogBox>
        </Box>
    );
};

export default ManageProjectContainer;
