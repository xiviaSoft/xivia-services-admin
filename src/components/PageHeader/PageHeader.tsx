import { Box, Stack, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import UserCard from "components/UserCard/UserCard";
import CustomTextField from "components/CustomTextField/CustomTextField";
import CustomButton from "components/CustomButton/CustomButton";
import { Add } from "@mui/icons-material";

interface PageHeaderProps {
    leftComponent?: "button" | "textfield";
    buttonTitle?: string;
    buttonIcon?: React.ReactNode;
    textFieldName?: string;
    textFieldPlaceholder?: string;
    title: string;
    subtitle?: string;
    onClick?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    leftComponent = "textfield",
    buttonTitle = "Add",
    buttonIcon = <Add />,
    textFieldName = "search",
    textFieldPlaceholder = "Search",
    title,
    subtitle,
    onClick,
}) => {
    const methods = useForm({ defaultValues: { [textFieldName]: "" } });

    return (
        <FormProvider {...methods}>
            <Stack
                component="header"
                direction={{ xs: "column", md: "row" }}
                gap={{ xs: 2, md: 3 }}
                sx={{
                    mb: 4,
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", md: "center" },
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            mb: 0.5,
                            color: "#718096",
                            fontSize: 11,
                            fontWeight: 800,
                            letterSpacing: ".14em",
                            textTransform: "uppercase",
                        }}
                    >
                        Workspace
                    </Typography>
                    <Typography
                        component="h1"
                        sx={{
                            color: "#17243A",
                            fontSize: { xs: 26, md: 31 },
                            fontWeight: 800,
                            letterSpacing: "-.035em",
                            lineHeight: 1.15,
                        }}
                    >
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography sx={{ mt: 0.75, color: "#7A8799", fontSize: 13 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                <Stack
                    direction={{ xs: "column-reverse", sm: "row" }}
                    spacing={1.5}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    justifyContent={{ xs: "stretch", sm: "flex-end" }}
                >
                    {leftComponent === "button" ? (
                        <CustomButton
                            title={buttonTitle}
                            variant="contained"
                            startIcon={buttonIcon}
                            onClick={onClick}
                            background="#167D75"
                            textColor="#FFFFFF"
                        />
                    ) : (
                        <Box sx={{ width: { xs: "100%", sm: 250 } }}>
                            <CustomTextField
                                name={textFieldName}
                                placeholder={textFieldPlaceholder}
                                type="text"
                                width="100%"
                                showSearchIcon
                            />
                        </Box>
                    )}
                    <UserCard />
                </Stack>
            </Stack>
        </FormProvider>
    );
};

export default PageHeader;
