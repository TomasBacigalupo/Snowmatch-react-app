import { Box, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SwipeableDrawer } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import EnterSnowMatchCodeStep from "./EnterSnowMatchCodeStep";
import { formatTextWithHighlight } from "src/utils/formatTextWithHighlight";

export default function VideoUploadBottomSheet({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      image: "/assets/courses/groom.jpeg",
      title: "Welcome to SnowMatch Academy",
      description:
        "Improve your skiing technique with personalized feedback from SnowMatch Academy – upload your videos and refine your skills like never before!",
    },
    {
      image: "/assets/courses/groom_skiing.jpg",
      title: "The Four Core Skills",
      description:
        "Over 40 levels, you’ll steadily progress by building and enhancing four core carving skills, ensuring continuous improvement at every stage.",
    },
    {
      image: "/assets/courses/groom.jpeg",
      title: "How to Play and Progress",
      description:
        "To pass each level, you need to upload a 30-second video of skiing that meets or exceeds the target criteria.",
    },
  ];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (activeStep === 0) return;
    setActiveStep((prev) => prev - 1);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
  });

  useEffect(() => {
    if (!open) setActiveStep(0);
  }, [open]);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      {...swipeHandlers}
      PaperProps={{
        sx: {
          height: "100%",
          maxHeight: "100%",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {activeStep < steps.length ? (
          <>
            {/* Cover Image Section */}
            <Box
              sx={{
                height: "50vh",
                position: "relative",
                backgroundImage: `url(${steps[activeStep].image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                "::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  zIndex: 1,
                },
              }}
            >
              {/* Close Icon */}
                <IconButton
                  onClick={onClose}
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    zIndex: 3,
                    color: "black"
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>

              {/* Title */}
              <Typography
                variant="h1"
                sx={{
                  position: "absolute",
                  top: 56,
                  left: 16,
                  right: 48,
                  color: "#2B2B2B",
                  fontWeight: "bold",
                  lineHeight: 1.4,
                  textAlign: "left",
                  zIndex: 2,
                }}
              >
                {formatTextWithHighlight(steps[activeStep].title)}
              </Typography>

              {/* Logo */}
              <Box
                sx={{
                  position: "absolute",
                  top: 235,
                  left: 16,
                  zIndex: 2,
                }}
              >
                <img
                  src="/logo/logo_fondo_blanco.png"
                  alt="Logo"
                  style={{ width: 46, height: 46, borderRadius: 8 }}
                />
              </Box>
            </Box>

            {/* Content Section */}
            <Box
              sx={{
                flex: 1,
                backgroundColor: "white",
                textAlign: "center",
                p: 3,
                borderRadius: "16px 16px 0 0",
                position: "relative",
                top: -16,
                zIndex: 1,
              }}
            >
              <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
                {formatTextWithHighlight(steps[activeStep].description)}
              </Typography>
            </Box>

            {/* Navigation Section */}
            <Box
              sx={{
                p: 2,
                backgroundColor: "white",
              }}
            >
              <Box display="flex" justifyContent="center" mb={3}>
                {steps.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      mx: 0.5,
                      borderRadius: "50%",
                      backgroundColor:
                        index === activeStep ? "primary.main" : "grey.400",
                    }}
                  />
                ))}
              </Box>
              <Button
                onClick={handleNext}
                variant="contained"
                fullWidth
                sx={{ textTransform: "none" }}
              >
                {activeStep === steps.length - 1 ? "Start Now" : "Continue"}
              </Button>
            </Box>
          </>
        ) : (
          // Render the new "Enter SnowMatch Code" step
          <EnterSnowMatchCodeStep
            onAddCode={() => console.log("Code added")}
            onSupport={() => console.log("Contact support")}
            onClose={onClose}
          />
        )}
      </Box>
    </SwipeableDrawer>
  );
}