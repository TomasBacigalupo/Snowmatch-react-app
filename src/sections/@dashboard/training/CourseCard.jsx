import { Box, Typography } from "@mui/material";
import useLocales from "src/hooks/useLocales";
import BlurCard from "./BlurCardTitle";
import { Icon } from "@iconify/react";

export default function CourseCard({ post, onClick }) {
    const { translate } = useLocales();
    console.log("post", post)
    if (post.code === "CARVING" || post.code === "BUMPS") {
        return (
            <Box
                onClick={onClick}
                sx={{
                    width: '100%',
                    height: 180,
                    borderRadius: 2,
                    overflow: "hidden",
                    backgroundColor: "primary.light",
                    cursor: "pointer",
                    "&:hover": { boxShadow: 4 },
                    position: "relative",
                    textAlign: "center"
                }}
            >
                {/* Upper Section: Image */}
                <Box
                    component="img"
                    src={post.cover}
                    alt={post.title}
                    sx={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        objectPosition: "center 20%",
                    }}
                />

                {/* Overlay Content */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Icon icon={post.icon} width="30" color="white"/>
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        position: "absolute",
                        top: 137,
                        right: 8,
                        color: "primary.dark",
                        fontWeight: "bold",

                    }}
                >
                    {post.points} pts
                </Typography>

                {/* Lower Section: Title and Description */}
                <Box
                    sx={{
                        p: 2,
                        backgroundColor: "grey.100",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="text.primary"
                        sx={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            mb: 1,
                        }}
                    >
                        {translate(`course.${post.code}.title`)}
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (post.code === "GENERAL") {
        return (
            <Box
                onClick={onClick}
                sx={{
                    width: '100%',
                    height: 230,
                    borderRadius: 2,
                    overflow: "hidden",
                    backgroundColor: "primary.light",
                    cursor: "pointer",
                    "&:hover": { boxShadow: 4 },
                    position: "relative",
                }}
            >
                {/* Upper Section: Image */}
                <Box
                    component="img"
                    src={post.cover}
                    alt={post.title}
                    sx={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        objectPosition: "center 20%",
                    }}
                />

                {/* Overlay Content */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Icon icon={post.icon} width="30" color="white"/>
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        position: "absolute",
                        top: 125,
                        right: 8,
                        color: "primary.dark",
                        fontWeight: "bold",
                    }}
                >
                    mejora tu esquiada
                </Typography>

                {/* Lower Section: Title and Description */}
                <Box
                    sx={{
                        p: 2,
                        backgroundColor: "grey.100",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="text.primary"
                        sx={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            mb: 1,
                        }}
                    >
                        Esquiada completa
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "primary.dark",
                            fontWeight: "bold",
                            whiteSpace: "normal",
                        }}
                    >
                        Subi un video de cualquier bajada para recibir una corrección y cómo mejorar
                    </Typography>
                </Box>
            </Box>
        );
    }

    return <BlurCard image={post.cover} title={post.title} onClick={onClick}/>

}