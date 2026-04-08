import { TableRow, TableCell, Box, } from "@mui/material";
import { CustomDialogBox } from "components";
import { useForm } from "react-hook-form";
import { AddUser } from "screens";
import { useState } from "react";

interface teamProps {
    id: string;
    name: string;
    description: string;
    images: string;
    role: string;
    children: React.ReactNode;
}

const TeamMember = ({  name, description, images, role, children }: teamProps) => {
    const firstName = name.split(" ").slice(0, 1).join();
    const lastName = name.split(' ').slice(1).join();
    const [openUpdate, setOpenUpdate] = useState(false);
    const methods = useForm({
        defaultValues: {
            firstName: firstName || "",
            lastName: lastName || "",
            description: description,
            role: role
        }
    });


    const handleClose = () => {
        setOpenUpdate(false);
    };

    return (
        <>
            <TableRow>
                <TableCell>
                    <Box
                        component="img"
                        sx={{ height: 60, width: 60, borderRadius: "6px" }}
                        src={images}
                    />
                </TableCell>

                <TableCell>{name}</TableCell>

                <TableCell>{description}</TableCell>

                <TableCell>{role}</TableCell>

                <TableCell>
                    {children}
                </TableCell>
            </TableRow>

            <CustomDialogBox
                open={openUpdate}
                onClose={handleClose}
                title="Update Employee" >
                <AddUser />
            </CustomDialogBox>
        </>
    );
};

export default TeamMember;
