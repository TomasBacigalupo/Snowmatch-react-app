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

const BackgroundMountain = () => (
    <Box
        sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            backgroundImage: 'url(/assets/resorts/snowmatchresort.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.6) 100%)',
                zIndex: 1
            }
        }}
    >
    </Box>
);

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
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                background: level.status === "locked" ? 
                    'linear-gradient(145deg, #e6e6e6, #cccccc)' : 
                    undefined
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
                position: 'relative',
                display: "block",
                width: "100%",
                height: "100%",
                overflowY: "auto",
                pt: 1,
                mx: -1.5,
                width: "100dvw",
            }}
        >
            <BackgroundMountain />
            
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                {/* Path Line */}
                <Box
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        top: 0,
                        bottom: 0,
                        width: 2,
                        background: 'linear-gradient(to bottom, transparent, #e0e9f1, transparent)',
                        zIndex: 1
                    }}
                />

                {levels.map((level, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <React.Fragment key={level.id}>
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: isEven ? "flex-start" : "flex-end",
                                    pr: 2,
                                    pl: 2,
                                    mb: 4,
                                    position: 'relative',
                                    zIndex: 2
                                }}
                                component={m.div}
                                initial={{ x: isEven ? 400 : -400, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                {!isEven && <LevelButton level={level} />}
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        m: 1,
                                        color: '#2c3e50',
                                        textShadow: '1px 1px 1px rgba(255,255,255,0.5)',
                                        fontWeight: 600
                                    }}
                                >
                                    {level.name}
                                </Typography>
                                {isEven && <LevelButton level={level} />}
                            </Box>
                            
                            {(index + 1) % 3 === 0 && (
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 4,
                                        position: 'relative',
                                        zIndex: 2
                                    }}
                                >
                                    <Divider 
                                        sx={{ 
                                            flex: 1,
                                            borderColor: 'rgba(0,0,0,0.1)'
                                        }} 
                                    />
                                    <m.div
                                        animate={{ 
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 360]
                                        }}
                                        transition={{ 
                                            duration: 4,
                                            repeat: Infinity
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: "50%",
                                                backgroundColor: "primary.main",
                                                margin: "0 10px",
                                                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    </m.div>
                                    <Divider 
                                        sx={{ 
                                            flex: 1,
                                            borderColor: 'rgba(0,0,0,0.1)'
                                        }} 
                                    />
                                </Box>
                            )}
                        </React.Fragment>
                    );
                })}
            </Box>
        </Box>
    );
};

export default SkiProgress;