import { Button, ButtonProps } from "@mui/material";
import { COLORS } from "constant/color";
import { ReactNode } from "react";

interface ButtonTypes extends Omit<ButtonProps, "title"> {
    title?: ReactNode;
    textColor?: string;
    background?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const CustomButton = ({
    variant = "contained",
    title,
    endIcon,
    startIcon,
    onClick,
    textColor,
    background,
    sx,
    ...props
}: ButtonTypes) => {
    const additionalSx = Array.isArray(sx) ? sx : sx ? [sx] : [];

    return (
        <Button
            {...props}
            variant={variant}
            startIcon={startIcon}
            endIcon={endIcon}
            onClick={onClick}
            sx={[
                {
                    maxWidth: "100%",
                    borderRadius: "12px",
                    textTransform: "none",
                    px: 2.25,
                    py: 1.15,
                    fontWeight: 700,
                    transition: "background-color 160ms ease, box-shadow 160ms ease",
                    ...(variant === "contained" && {
                        backgroundColor: background || COLORS.primary.main,
                        color: textColor || COLORS.white.main,
                        boxShadow: "0 5px 14px rgba(22, 75, 68, .14)",
                        "&:hover": {
                            backgroundColor: background || COLORS.primary.hardDark,
                            boxShadow: "0 7px 18px rgba(22, 75, 68, .2)",
                        },
                    }),
                    ...(variant === "outlined" && {
                        border: `1px solid ${COLORS.primary.main}`,
                        color: COLORS.primary.main,
                        backgroundColor: "transparent",
                        "&:hover": {
                            borderColor: COLORS.primary.hardDark,
                            backgroundColor: "rgba(52, 94, 88, .06)",
                        },
                    }),
                },
                ...additionalSx,
            ]}
        >
            {title}
        </Button>
    );
};
export default CustomButton;
