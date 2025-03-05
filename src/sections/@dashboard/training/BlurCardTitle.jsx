import { Box, Typography } from "@mui/material";

export default function BlurCard({ title, image, onClick }) {
    return (
        <Box
            onClick={onClick}
            sx={{
                width: 220,
                height: 300,
                borderRadius: 3,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "grey.200",
            }}
        >
            {/* Background Image with Blur */}
            <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(0.5px)", // Blur effect
                }}
            />

            {/* Overlay to reduce brightness */}
            <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.4)", // White overlay
                }}
            />

            {/* Title */}
            <Typography
                variant="h2"
                fontWeight="bold"
                color="text.primary"
                sx={{ position: "relative", textAlign: "center" }}
            >
                {title}
            </Typography>
        </Box>
    );
}