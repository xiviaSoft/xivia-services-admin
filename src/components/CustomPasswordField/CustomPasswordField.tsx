import { Box, TextField, InputAdornment, Typography, IconButton } from "@mui/material";
import { Controller, useFormContext, RegisterOptions } from "react-hook-form";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import React, { useState, useCallback } from "react";

interface CustomPasswordFieldProps {
    name: string;
    label?: string;
    width?: string;
    height?: string;
    readOnly?: boolean;
    maxLength?: number;
    disabled?: boolean;
    placeholder: string;
    description?: string;
    defaultValue?: string;
    rules?: RegisterOptions;
    showHelperText?: boolean;
    onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void;
}

const CustomPasswordField: React.FC<CustomPasswordFieldProps> = ({
    name,
    rules,
    width,
    label,
    height,
    onBlur,
    onFocus,
    disabled,
    maxLength,
    placeholder,
    defaultValue,
    readOnly = false,
    showHelperText = true,
    ...props
}) => {
    const { control } = useFormContext();
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (maxLength && e.target.value.length > maxLength) {
                e.target.value = e.target.value.slice(0, maxLength);
            }
        },
        [maxLength]
    );

    return (
        <Box width={{ md: width, sm: width, xs: "100%" }}>
            {label && (
                <Typography sx={{ mb: "7px", fontSize: "12px", fontWeight: 700, color: "#596A80" }}>
                    {label}
                </Typography>
            )}
            <Controller
                name={name}
                defaultValue={defaultValue}
                control={control}
                rules={rules}
                render={({ field, fieldState }) => (
                    <TextField
                        variant="outlined"
                        disabled={disabled}
                        {...field}
                        placeholder={placeholder || ""}
                        {...props}
                        fullWidth
                        error={!!fieldState.error}
                        helperText={showHelperText ? fieldState.error?.message : ""}
                        inputProps={{ maxLength, readOnly, onInput: handleInputChange }}
                        type={showPassword ? "text" : "password"}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                width: width || "285px",
                                backgroundColor: "#F8FAFC",
                                height: height || "56px",
                                borderRadius: "12px",
                                "& fieldset": { border: "1px solid #E1E8F0" },
                                "&:hover fieldset": { borderColor: "#B9C9D7" },
                                "&.Mui-focused fieldset": { borderColor: "#167D75 !important" },
                            },
                        }}
                        onBlur={(event) => {
                            field.onBlur();
                            onBlur?.(event);
                        }}
                        onFocus={onFocus}
                    />
                )}
            />
        </Box>
    );
};

export default CustomPasswordField;
