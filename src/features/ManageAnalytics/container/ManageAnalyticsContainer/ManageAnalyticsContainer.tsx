"use client";

import {
  CustomButton,
  CustomDialogBox,
  CustomTextField,
  PageHeader,
} from "components";

import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  TableContainer,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { db } from "libs";

interface ServiceItem {
  id: string;
  text: string;
  detail: string;
  icon: string;
  bgcolor: string;
}

const ManageServicesContainer = () => {
  const methods = useForm();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openDialog, setOpenDialog] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  /* FETCH SERVICES */
  const fetchServices = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "services"));
      const list: ServiceItem[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ServiceItem, "id">),
      }));
      setServices(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  /* DELETE */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    await deleteDoc(doc(db, "services", id));
    fetchServices();
  };

  const handleEdit = (service: ServiceItem) => {
    setEditId(service.id);
    methods.reset(service);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditId(null);
    methods.reset({
      icon: "",
      text: "",
      detail: "",
      bgcolor: "",
    });
    setOpenDialog(true);
  };

  const handleConfirmDialog = async () => {
    const data = methods.getValues();
    editId
      ? await updateDoc(doc(db, "services", editId), data)
      : await addDoc(collection(db, "services"), data);

    setOpenDialog(false);
    fetchServices();
  };

  return (
    <>
      <PageHeader title="Manage Services" />

      <Box display="flex" justifyContent="space-between" alignItems={'center'} mb={3}>
        <Typography>Current Services ({services.length})</Typography>
        <CustomButton
          variant="contained"
          title="Add Service"
          onClick={handleAdd}
          endIcon={<Add />}
        />
      </Box>

      {/* CONTENT */}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : isMobile ? (
        /* MOBILE VIEW (CARDS) */
        <Grid container spacing={2}>
          {services.map((s) => (
            <Grid size={{ xs: 12 }} key={s.id}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography fontWeight={600}>
                      {s.icon} {s.text}
                    </Typography>

                    <Typography variant="body2">
                      {s.detail}
                    </Typography>

                    <Typography variant="caption">
                      Bg Color: {s.bgcolor}
                    </Typography>

                    <Stack direction="row" justifyContent="flex-end">
                      <IconButton onClick={() => handleEdit(s)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(s.id)}>
                        <Delete color="error" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* DESKTOP VIEW (TABLE) */
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Icon</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Detail</TableCell>
                <TableCell>Bg Color</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {services.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.icon}</TableCell>
                  <TableCell>{s.text}</TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    {s.detail.length > 100
                      ? s.detail.slice(0, 100) + "..."
                      : s.detail}
                  </TableCell>
                  <TableCell>{s.bgcolor}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(s)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(s.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ADD / UPDATE DIALOG */}
      <CustomDialogBox
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDialog}
        title={editId ? "Update Service" : "Add Service"}
        icon={editId ? <Edit /> : <Add />}
        confirmText={editId ? "Update" : "Save"}
        cancelText="Cancel"
      >
        <FormProvider {...methods}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <CustomTextField type="text" placeholder="Icon Directry" name="icon" label="Service Icon" />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField type="text" placeholder="Title" name="text" label="Service Title" />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                type="text"
                placeholder="Descripiton"
                name="detail"
                label="Service Detail"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                placeholder=""
                name="bgcolor"
                label="Background Color"
                type="color"
              />
            </Grid>
          </Grid>
        </FormProvider>
      </CustomDialogBox>
    </>
  );
};

export default ManageServicesContainer;
