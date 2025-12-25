import {
  CustomButton,
  CustomDialogBox,
  CustomTextField,
  PageHeader,
} from "components";

import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Box, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Grid, Typography,
} from "@mui/material";

import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, } from "firebase/firestore";
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

  const [openDialog, setOpenDialog] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  /* 🔥 FETCH SERVICES*/
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

  /* 🗑 DELETE SERVICE */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    await deleteDoc(doc(db, "services", id));
    fetchServices();
  };

  /* * ✏ UPDATE — OPEN DIALOG WITH VALUES FILLED */
  const handleEdit = (service: ServiceItem) => {
    setEditId(service.id);

    methods.reset({
      icon: service.icon,
      text: service.text,
      detail: service.detail,
      bgcolor: service.bgcolor,
    });

    setOpenDialog(true);
  };

  /*   * ➕ ADD — CLEAR FORM & OPEN DIALOG */
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

  /* * ✅ SAVE (ADD OR UPDATE)*/
  const handleConfirmDialog = async () => {
    const data = methods.getValues();

    if (editId) {
      // UPDATE
      await updateDoc(doc(db, "services", editId), data);
    } else {
      // ADD
      await addDoc(collection(db, "services"), data);
    }

    setOpenDialog(false);
    fetchServices();
  };
  return (
    <>
      <PageHeader title="Manage Services" />

      <CustomButton
        variant="contained"
        title="Add Service"
        onClick={handleAdd}
        endIcon={<Add />}
        sx={{ mb: 3, }}
      />

      {/* SERVICES TABLE */}
      <Box my={2}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Icon</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Detail</TableCell>
                <TableCell>Bg Color</TableCell>
                <TableCell>Actions</TableCell>
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

                  <TableCell>
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
        )}
      </Box>

      {/*ADD / UPDATE SERVICE DIALOG*/}
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
            <Grid size={12}>
              <CustomTextField placeholder="icon" name="icon" label="Service Icon" type="text" />
            </Grid>

            <Grid size={12}>
              <CustomTextField placeholder="Title" name="text" label="Service Title" type="text" />
            </Grid>

            <Grid size={12}>
              <CustomTextField
                name="detail"
                label="Service Detail"
                type="text"
                placeholder="Description"
                multiline
                minRows={4}
              />
            </Grid>

            <Grid size={12}>
              <CustomTextField
                placeholder="#FFD877"
                name="bgcolor"
                label="Background Color For The Icon Box"
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
