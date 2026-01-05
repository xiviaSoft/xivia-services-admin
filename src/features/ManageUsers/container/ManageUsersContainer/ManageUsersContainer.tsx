"use client";

import { CustomButton, PageHeader, CustomDialogBox, } from "components";
import {
    Box, Button, Stack, Table, TableBody, TableCell, TableHead, TableRow, Card, CardContent, Typography, TableContainer, Grid, useTheme, useMediaQuery,
} from "@mui/material";

import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import TeamMember from "features/ManageUsers/components/GetTeam/Team";
import { ManangeAddUserContainer } from "features/ManangeAddUser";
import { FormProvider, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import { db } from "libs";

export interface Team {
    id?: string | any;
    name: string;
    description: string;
    role: string;
    images: string;
}

const ManageMemberContainer = () => {
    const methods = useForm();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [team, setTeam] = useState<Team[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Team | null>(null);

    /* FETCH TEAM */
    const fetchTeam = async () => {
        const snap = await getDocs(collection(db, "team-member"));
        const items = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Team),
        }));
        setTeam(items);
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleOpenDialog = (member?: Team) => {
        setSelectedMember(member || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    /* DELETE */
    const delMember = async (id: string) => {
        await deleteDoc(doc(db, "team-member", id));
        setTeam((prev) => prev.filter((mem) => mem.id !== id));
    };

    return (
        <FormProvider {...methods}>
            <Stack gap={3}>
                <PageHeader title="Manage Employees" />

                <Box display="flex" justifyContent="space-between" alignItems={'center'}>
                    <Typography>Current Member ({team.length})</Typography>
                    <CustomButton
                        variant="contained"
                        title="Add New Employee"
                        onClick={() => handleOpenDialog()}
                        endIcon={<Add />}
                    />
                </Box>

                {/* ADD / UPDATE DIALOG */}
                <CustomDialogBox
                    open={openDialog}
                    onClose={handleCloseDialog}
                    title={selectedMember ? "Update Employee" : "Add Employee"}
                >
                    <ManangeAddUserContainer
                        open={handleCloseDialog}
                        initialData={
                            selectedMember
                                ? {
                                    firstName: selectedMember.name.split(" ")[0],
                                    lastName: selectedMember.name.split(" ").slice(1).join(" "),
                                    about: selectedMember.description,
                                    role: selectedMember.role,
                                    memberRole: [],
                                    facebook: "",
                                    linkedin: "",
                                }
                                : undefined
                        }
                        id={selectedMember?.id}
                        onSuccess={fetchTeam}
                    />
                </CustomDialogBox>

                {/* CONTENT */}
                {isMobile ? (
                    /* MOBILE VIEW */
                    <Grid container spacing={2}>
                        {team.map((mem) => (
                            <Grid size={{ xs: 12 }} key={mem.id}>
                                <Card>
                                    <CardContent>
                                        <Stack spacing={1}>
                                            <Typography fontWeight={600}>
                                                {mem.name}
                                            </Typography>

                                            <Typography variant="body2">
                                                {mem.description}
                                            </Typography>

                                            <Typography variant="caption">
                                                Role: {mem.role}
                                            </Typography>

                                            <Stack direction="row" justifyContent="flex-end" gap={1}>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => delMember(mem.id!)}
                                                >
                                                    Delete
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleOpenDialog(mem)}
                                                >
                                                    Update
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    /* DESKTOP VIEW */
                    <TableContainer sx={{ overflowX: "auto" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {team.map((mem) => (
                                    <TeamMember
                                        key={mem.id}
                                        id={mem.id}
                                        name={mem.name}
                                        description={mem.description}
                                        role={mem.role}
                                        images={mem.images}
                                    >
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => delMember(mem.id!)}
                                            sx={{ mr: 1 }}
                                        >
                                            Delete
                                        </Button>

                                        <Button
                                            variant="contained"
                                            onClick={() => handleOpenDialog(mem)}
                                        >
                                            Update
                                        </Button>
                                    </TeamMember>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Stack>
        </FormProvider>
    );
};

export default ManageMemberContainer;
