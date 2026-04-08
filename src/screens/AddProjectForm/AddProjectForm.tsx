import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { CustomButton, CustomTextField } from "components";
import { FormProvider, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { db, } from "libs";

interface AddProjectFormProps {
  project?: any; // existing project for update
  onClose: () => any;
}

const AddProjectForm = ({ project, onClose }: AddProjectFormProps) => {
  const methods = useForm({
    defaultValues: {
      title: "",
      client: "",
      category: "",
      link: "",
      description: "",
      image: "",
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (project) {
      methods.reset({
        title: project.title,
        client: project.client,
        category: project.category,
        link: project.link,
        description: project.description,
      });

      // Show image preview if exists
      if (project.image) setPreview(project.image);
    }
  }, [project, methods]);

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmitData = async (data: any) => {
    try {
      let imageUrl = project?.image || "";

      // Upload only if user selects new image
      // if (imageFile) {
      //   const storageRef = ref(storage, `gallery/${imageFile.name}-${Date.now()}`);
      //   await uploadBytes(storageRef, imageFile);
      //   imageUrl = await getDownloadURL(storageRef);
      // }

      const payload = {
        title: data.title,
        client: data.client,
        category: data.category,
        link: data.link,
        description: data.description,
        image: imageUrl,
      };

      if (project) {
        // UPDATE 
        await updateDoc(doc(db, "gallery", project.id), payload);
        alert("Project updated successfully!");
      } else {
        //  ADD MODE
        await addDoc(collection(db, "gallery"), {
          ...payload,
          createdAt: new Date(),
        });
        alert("Project added successfully!");
      }

      methods.reset();
      setImageFile(null);
      setPreview("");

    } catch (error) {
      console.error("Upload error:", error);
      alert("Error saving project");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmitData)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pr: { xs: 2, md: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {project ? "Update Project" : "Add New Project"}
          </Typography>

          {/* Title + Client */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
            <CustomTextField type="text" name="client" placeholder="Client Name" maxLength={40} />
            <CustomTextField type="text" name="title" placeholder="Project Title" maxLength={40} />
          </Box>

          <CustomTextField type="text" name="category" placeholder="Project Category" maxLength={40} />
          <CustomTextField type="text" name="link" placeholder="Project URL" maxLength={100} />

          <CustomTextField
            type="text"
            name="description"
            placeholder="Project Description"
            maxLength={400}
            height="100px"
            multiline
          />

          {/* Image Upload */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography sx={{ fontWeight: 500 }}>Project Image</Typography>

            {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}

            {preview && (
              <Box
                component="img"
                src={preview}
                alt="preview"
                sx={{
                  width: 180,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 2,
                  mt: 1,
                }}
              />
            )}
          </Box>

          <CustomButton title={project ? "Update" : "Submit"} type="submit" />
        </Box>
      </form>
    </FormProvider>
  );
};

export default AddProjectForm;
