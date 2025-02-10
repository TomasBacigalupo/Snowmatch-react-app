import React from "react";
import { Box, Typography, Button, TextField, Link } from "@mui/material";

const EnterSnowMatchCodeStep = ({ onAddCode, onSupport }) => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        textAlign: "center",
        p: 3,
      }}
    >
      {/* Title */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        
      </Typography>
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2, 
        }}
      >
        <img
          src="/logo/snowmatch.png" 
          alt="SnowMatch Logo"
        />
      </Box>
      {/* Input Section */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Enter SnowMatch Code
        </Typography>
        <TextField
          placeholder="SNM123"
          variant="outlined"
          fullWidth
          sx={{
            mb: 2,
            textAlign: "center",
            fontSize: "1.5rem",
            "& .MuiInputBase-input": {
              textAlign: "center",
              fontSize: "1.5rem",
            },
          }}
        />
        <Box textAlign="left" sx={{ mt: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography
              sx={{ fontSize: "1.2rem", mr: 2, color: "grey.700" }}
              variant="body1"
            >
              📧
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the code you received by email (can be delayed up to 48
              hours).
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography
              sx={{ fontSize: "1.2rem", mr: 2, color: "grey.700" }}
              variant="body1"
            >
              🎿
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your pass activates when you first ski.
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography
              sx={{ fontSize: "1.2rem", mr: 2, color: "grey.700" }}
              variant="body1"
            >
              📅
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Renewal is set for 1 year from activation.
            </Typography>
          </Box>
        </Box>
        <Link
          href="#"
          underline="hover"
          sx={{ display: "block", mt: 2, color: "primary.main" }}
        >
          I can’t find my SnowMatch Code
        </Link>
      </Box>

      {/* Buttons */}
      <Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onAddCode}
          sx={{ mb: 2 }}
        >
          Add SnowMatch Pass
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={onSupport}
        >
          Contact Support
        </Button>
      </Box>
    </Box>
  );
};

export default EnterSnowMatchCodeStep;