import { Box } from "@mui/material";
import { PageHeader } from "components";
import ManageWebProjects from "components/Projects/Web/ManageWebProjects";
import { ManageMobileProjects } from "components/Projects/Mobile/ManageMobileProjects";



const ManageProjectContainer = () => {


    return (
        <Box
            sx={{
                maxWidth: "1400px",
                py: { xs: 2, sm: 3 },
            }}
        >
            <PageHeader title="Manage Projects" />
            <ManageWebProjects />
            <br />
            <ManageMobileProjects />
        </Box>
    );
};

export default ManageProjectContainer;
