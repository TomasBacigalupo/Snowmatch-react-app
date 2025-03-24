import { Box, IconButton, Typography } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";

const MobileHeader = ({ title, onBack }) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="sticky"
            top={0}
            left={0}
            right={0}
            mt={2}
            px={2}
            sx={{
                borderBottom: "2px solid #EBEBEB",
                zIndex: 1000,
                backgroundColor: "white",
            }}
        >
            {/* Botón de retroceso */}
            <Box mr="auto">
                <IconButton edge="start" color="inherit" onClick={onBack} aria-label="back">
                    <ArrowBack />
                </IconButton>
            </Box>

            {/* Título centrado */}
            <Typography
                variant="h4"
                sx={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontWeight: 600,
                    color: "#222222",
                }}
            >
                {title}
            </Typography>
        </Box>
    );
};

export default MobileHeader;
