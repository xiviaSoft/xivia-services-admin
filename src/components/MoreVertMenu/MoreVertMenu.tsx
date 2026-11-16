"use client"
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

interface MenuItemType {
    label: string;
    action: () => void;
}

interface MoreVertMenuProps {
    items: MenuItemType[];
    icon?: React.ReactNode;
    isAvatar?: boolean;
    avatarLabel?: string;
}

const MoreVertMenu = ({ items, icon, isAvatar, avatarLabel }: MoreVertMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                size="small"
                onClick={handleMenuOpen}
                aria-label={isAvatar ? "Open account menu" : "Open actions menu"}
                aria-haspopup="menu"
                sx={isAvatar ? { p: 0 } : undefined}
            >
                {isAvatar ? (
                    <Avatar sx={{ width: 38, height: 38, bgcolor: "#D9F1E9", color: "#176B62", fontSize: 13, fontWeight: 800 }}>
                        {avatarLabel}
                    </Avatar>
                ) : (
                    icon || <MoreVertIcon />
                )}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {items.map((item, idx) => (
                    <MenuItem
                        key={idx}
                        onClick={() => {
                            handleMenuClose();
                            item.action();
                        }}
                        sx={{ p: '10px 16px', width: '200px' }}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default MoreVertMenu;
