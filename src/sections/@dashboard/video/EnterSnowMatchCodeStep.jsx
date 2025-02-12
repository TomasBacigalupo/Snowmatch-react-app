import React, { useState } from "react";
import { Box, Typography, Button, TextField, Link, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useAuth from "src/hooks/useAuth";
import { LoadingButton } from "@mui/lab";

const EnterSnowMatchCodeStep = ({ onClose, onAddToPremium }) => {

  const { addToPremium } = useAuth()
  const [loading, setLoading] = useState(false);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));



  const handleAddCode = async () => {
    setLoading(true)
    await addToPremium()
    await sleep(3000)
    onAddToPremium()
    setLoading(false)
    onClose()
  }

  const handleSupport = () => {

    const _message = encodeURIComponent(
      `👋 Hello SnowMatch Team,\n\nI would like to get my SnowMatch Pass.\n\n🔹 📅 Request Date: ${new Date().toLocaleDateString()}\n`
    );
    const url = `https://api.whatsapp.com/send/?phone=5492944263223&text=${_message}&type=phone_number&app_absent=0`;

    window.open(url, '_blank');
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        textAlign: "center",
        p: 3,
        pt: 'env(safe-area-inset-top)'
      }}
    >
      {/* Close Icon */}
      <IconButton
        onClick={onClose}
        sx={{
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
          helperText="SM123 works 😉"
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
          onClick={handleSupport}
          sx={{ display: "block", mt: 2, color: "primary.main" }}
        >
          I can’t find my SnowMatch Code
        </Link>
      </Box>

      {/* Buttons */}
      <Box>
        <LoadingButton
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddCode}
          loading={loading}
          sx={{ mb: 2 }}
        >
          Add SnowMatch Pass
        </LoadingButton>
        <LoadingButton
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handleSupport}
        >
          Contact Support
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default EnterSnowMatchCodeStep;