import { CustomPasswordField, CustomSelect, CustomTextField } from "components";
import { Stack } from "@mui/material";
import { ADMIN_ROLE } from "constant";

interface AddAdminProps {
    mode?: "add" | "edit";
}

const AddAdmin = ({ mode = "add" }: AddAdminProps) => {
    return (
        <Stack spacing={2}>
            <CustomSelect
                name="role"
                label="Select Role"
                labelOutside={true}
                options={ADMIN_ROLE.map((item) => ({
                    label: item,
                    value: item,
                }))}
                isRequired
            />
            
            <CustomTextField
                name="firstName"
                placeholder="First Name"
                type="text"
                width="100%"
                maxLength={25}
                // required
            />
            
            <CustomTextField
                name="lastName"
                placeholder="Last Name"
                type="text"
                width="100%"
                maxLength={25}
                // required
            />
            
            <CustomTextField
                name="email"
                placeholder="Email Address"
                type="email"
                width="100%"
                // required
                disabled={mode === "edit"} // Disable email editing
            />
            
            <CustomTextField
                name="phoneNumber"
                placeholder="Phone Number (Optional)"
                type="tel"
                width="100%"
                maxLength={15}
            />

            {/* Only show password when adding */}
            {mode === "add" && (
                <CustomPasswordField
                    name="password"
                    placeholder="Password"
                    width="100%"
                    maxLength={25}
                    rules={{
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                        },
                        validate: (value: string) =>
                            (/[A-Z]/.test(value) &&
                                /[a-z]/.test(value) &&
                                /[0-9!@#$%^&*(),.?":{}|<>]/.test(value)) ||
                            "Use uppercase and lowercase letters, and at least one number or symbol",
                    }}
                />
            )}
        </Stack>
    );
};

export default AddAdmin;