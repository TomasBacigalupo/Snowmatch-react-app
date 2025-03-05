import React from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import { m } from "framer-motion";

const levels = [
    { id: 1, status: "completed", name: "Face Front" },
    { id: 2, status: "unlocked", name: "Clap Turn" },
    { id: 3, status: "locked", name: "Slide Cut" },
    { id: 4, status: "locked", name: "Airplane" },
    { id: 5, status: "locked", name: "Ricks" },
    { id: 6, status: "locked", name: "Inventar" },
];

const LevelButton = ({ level }) => {
    const getColor = () => {
        if (level.status === "completed") return "success";
        if (level.status === "unlocked") return "primary";
        return "grey";
    };

    return (
        <Button
            variant="contained"
            color={getColor()}
            sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                fontWeight: "bold",
            }}
            disabled={level.status === "locked"}
        >
            {level.id}
        </Button>
    );
};

const SkiProgress = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                height: "100vh",
                overflowY: "auto",
                p: 4,
            }}
        >
            {levels.map((level, index) => {
                const isEven = index % 2 === 0; // Alternar lados
                return (
                    <>
                        <Box
                            key={level.id}
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: isEven ? "flex-start" : "flex-end",
                                pr: isEven ? '20%': "px",
                                pl: !isEven ? '20%': "px",
                                mb: 4, // Espaciado vertical para no superponer
                            }}
                            component={m.div}
                            initial={{ x: isEven ? 400 : -400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}

                        >
                            {!isEven && <LevelButton level={level} />}
                            <Typography variant="h5" sx={{ m: 1 }}>
                               {level.name}
                            </Typography>
                            {isEven && <LevelButton level={level} />}
                        </Box>
                        {/* Separador con indicador después de cada 3 niveles */}
                        {(index + 1) % 3 === 0 && (
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 4,
                                }}
                            >
                                <Divider sx={{ flex: 1 }} />
                                <Box
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: "50%",
                                        backgroundColor: "primary.main",
                                        margin: "0 10px",
                                    }}
                                />
                                <Divider sx={{ flex: 1 }} />
                            </Box>
                        )}
                    </>
                );
            })}
        </Box>
    );
};

export default SkiProgress;