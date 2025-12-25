import { Controller, useFormContext, RegisterOptions } from "react-hook-form";
import { Box, TextField, InputAdornment, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useCallback } from "react";
import { COLORS } from "constant/color";

interface CustomTextFieldProps {
    name: string;
    label?: string;
    type: string;
    width?: string;
    height?: string;
    multiline?: any;
    minRows?: number;
    maxRows?: number;
    readOnly?: boolean;
    maxLength?: number;
    disabled?: boolean;
    placeholder: string;
    description?: string;
    autoComplete?: string;
    defaultValue?: string;
    rules?: RegisterOptions;
    showHelperText?: boolean;
    allowOnly?: "numeric" | "alphabetic" | "alphanumeric" | "decimal";
    onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void;
    endAdornment?: React.ReactNode;
    showSearchIcon?: boolean;
}

// validation rules
const getDefaultRules = (fieldName: string): RegisterOptions => {
    switch (fieldName) {
        case "email":
            return {
                required: "Email is required",
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                },
            };

        case "firstName":
        case "lastName":
            return {
                required: `${fieldName} is required`,
                maxLength: {
                    value: 25,
                    message: "Max 25 characters allowed",
                },
                pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: "Only alphabets allowed",
                },
            };

        case "password":
            return {
                required: "Password is required",
                minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                },
                maxLength: {
                    value: 25,
                    message: "Password must be less than 25 characters",
                }
            };

        default:
            return {};
    }
};

const CustomTextField: React.FC<CustomTextFieldProps> = ({
    name,
    type,
    rules,
    width,
    label,
    height,
    onBlur,
    minRows,
    maxRows,
    onFocus,
    disabled,
    multiline,
    maxLength,
    allowOnly,
    placeholder,
    defaultValue,
    autoComplete,
    readOnly = false,
    showHelperText = true,
    endAdornment,
    showSearchIcon = false,
    ...props
}) => {
    const { control } = useFormContext();

    // input filtering (client-side)
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;

            const patterns = {
                numeric: /[^0-9]/g,
                decimal: /[^0-9.]/g,
                alphabetic: /[^a-zA-Z]/g,
                alphanumeric: /[^a-zA-Z0-9]/g,
            };

            if (allowOnly && patterns[allowOnly]) {
                e.target.value = value.replace(patterns[allowOnly], "");
            }

            if (maxLength && e.target.value.length > maxLength) {
                e.target.value = e.target.value.slice(0, maxLength);
            }
        },
        [allowOnly, maxLength]
    );

    const isColorField = type === "color";

    return (
        <Box width={{ md: width, sm: width, xs: "100%" }}>
            {label && (
                <Typography
                    sx={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: COLORS.primary.hardDark,
                        m: "8px",
                    }}
                >
                    {label}
                </Typography>
            )}

            <Controller
                name={name}
                defaultValue={defaultValue}
                control={control}
                rules={{ ...getDefaultRules(name), ...rules }}
                render={({ field, fieldState }) => (
                    <TextField
                        {...field}
                        type={type}
                        variant="outlined"
                        disabled={disabled}
                        placeholder={placeholder || ""}
                        multiline={multiline}
                        fullWidth
                        minRows={minRows}
                        maxRows={maxRows}
                        error={!!fieldState.error}
                        helperText={showHelperText ? fieldState.error?.message : ""}
                        autoComplete={autoComplete}
                        InputProps={{
                            startAdornment:
                                showSearchIcon && !isColorField && (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: "gray" }} />
                                    </InputAdornment>
                                ),
                            endAdornment: !isColorField ? endAdornment : null,

                            sx: {
                                backgroundColor: COLORS.gray.lighter,
                                border: "none",
                                height: multiline ? "auto" : height || (isColorField ? "48px" : "56px"),
                                paddingRight: isColorField ? 0 : "8px",
                                "& fieldset": { border: isColorField ? "1px solid #ccc" : "none" },

                                ...(isColorField && {
                                    padding: 0,
                                    width: "64px",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                }),
                            },
                        }}
                        inputProps={{
                            maxLength,
                            onInput: handleInputChange,
                            readOnly,
                            ...(isColorField && {
                                style: {
                                    padding: 0,
                                    border: "none",
                                    width: "100%",
                                    height: "100%",
                                    cursor: "pointer",
                                },
                            }),
                        }}
                        onBlur={(event) => {
                            field.onBlur();
                            onBlur?.(event);
                        }}
                        onFocus={onFocus}
                        {...props}
                    />
                )}
            />
        </Box>
    );
};

export default CustomTextField;
