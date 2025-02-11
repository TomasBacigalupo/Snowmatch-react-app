import React from "react";
import { Box, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const InfoBox = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#DDFDF7", // Light cyan background
        padding: "12px 16px",
        borderRadius: "8px",
      }}
    >
      <InfoIcon sx={{ color: "#38A3A5", marginRight: "8px" }} />
      <Typography variant="body1">
        Use <strong>demo@minimals.cc</strong> with password{" "}
        <strong>@2Minimal</strong>
      </Typography>
    </Box>
  );
};

export default InfoBox;