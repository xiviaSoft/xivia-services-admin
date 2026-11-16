import { Dialog, DialogContent, DialogActions, Box, Typography, Icon } from "@mui/material";
import CustomButton from "components/CustomButton/CustomButton";
import { COLORS } from "constant/color";

interface CustomDialogBoxProps {
    open: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    onConfirm?: () => void | Promise<void>;
    confirmText?: string;
    cancelText?: string;
    icon?: React.ReactNode;
}

export const CustomDialogBox: React.FC<CustomDialogBoxProps> = ({
    open,
    title,
    children,
    onClose,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    icon,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"   
            sx={{
                "& .MuiPaper-root": {
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E6EBF2",
                    borderRadius: "20px",
                    width: "100%",
                    padding: { md: "30px", sm: "26px", xs: "18px" },
                    margin: {xs:1, md:0},
                    boxShadow: "0 24px 70px rgba(20, 34, 55, .18)",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    alignItems: "center",
                    pt: 1,
                    width: "100%",
                }}
            >
                {icon && (
                    <Icon
                        sx={{
                            bgcolor: COLORS.primary.hardDark,
                            height: "50px",
                            width: "50px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: COLORS.white.main,
                        }}
                    >
                        {icon}
                    </Icon>
                )}

                <Typography sx={{ fontSize: "19px", fontWeight: 800, color: "#1E2A3D" }}>
                    {title}
                </Typography>
            </Box>

            <DialogContent
                sx={{
                    width: "100%",                 // 👉 Make children full width
                    padding: 0,                    // 👉 Remove forced spacing
                    mt: 2,
                    maxHeight: "350px",
                    overflowY: "auto",
                    overflowX: "hidden",

                    "& > *": {
                        width: "100%",             // 👉 Force children to stretch fully
                    },

                    // Scrollbar styling
                    "&::-webkit-scrollbar": { inlineSize: "6px" },
                    "&::-webkit-scrollbar-track": {
                        background: COLORS.white.main,
                        borderRadius: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: COLORS.primary.main,
                        borderRadius: "8px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        background: COLORS.primary.hardDark,
                    },
                }}
            >
                {children}
            </DialogContent>

            <DialogActions sx={{ mt: 2, gap: 1, "& > :not(style) ~ :not(style)": { ml: 0 } }}>
                {onConfirm && <CustomButton title={confirmText} onClick={onConfirm} />}
                <CustomButton title={cancelText} onClick={onClose} variant="outlined" />
            </DialogActions>
        </Dialog>
    );
};

export default CustomDialogBox;
