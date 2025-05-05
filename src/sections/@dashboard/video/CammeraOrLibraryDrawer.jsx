import React from 'react';
import {
    Box,
    SwipeableDrawer,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import useLocales from "src/hooks/useLocales";

export default function CameraOrLibraryDrawer({ open, onClose, onOpen, onCameraSelect, onLibrarySelect }) {
    const { translate } = useLocales();

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            disableSwipeToOpen={false}
            ModalProps={{
                keepMounted: true,
            }}
            PaperProps={{
                sx: {
                    height: 'fit-content',
                    maxHeight: '100%',
                    width: '100vw',
                    maxWidth: '100%',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                },
            }}
        >
            <Box
                sx={{
                    padding: 2,
                }}
            >
                <Typography variant="h6" align="center" gutterBottom>
                    {translate('video.upload.select_source')}
                </Typography>
                <List>
                    <ListItem 
                        button 
                        onClick={onCameraSelect}
                        sx={{
                            borderRadius: 1,
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        }}
                    >
                        <ListItemIcon>
                            <CameraAltIcon />
                        </ListItemIcon>
                        <ListItemText 
                            primary={translate('video.upload.camera')}
                            primaryTypographyProps={{
                                variant: 'body1',
                            }}
                        />
                    </ListItem>
                    <Divider />
                    <ListItem 
                        button 
                        onClick={onLibrarySelect}
                        sx={{
                            borderRadius: 1,
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        }}
                    >
                        <ListItemIcon>
                            <VideoLibraryIcon />
                        </ListItemIcon>
                        <ListItemText 
                            primary={translate('video.upload.library')}
                            primaryTypographyProps={{
                                variant: 'body1',
                            }}
                        />
                    </ListItem>
                </List>
            </Box>
        </SwipeableDrawer>
    );
}
