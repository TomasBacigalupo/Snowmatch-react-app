import PropTypes from "prop-types";
import { Box, Typography, Paper, LinearProgress, Avatar, useTheme } from "@mui/material";
import { HourglassEmpty, Timer, CheckCircleOutline } from "@mui/icons-material";

export const VideoReviewStatus = ({ proCheck, reviewed }) => {
  const theme = useTheme(); // Obtiene los colores del theme

  return (
    <Box sx={{ mt: 2 }}>
      {proCheck && !reviewed && (
        <Paper
        sx={{
          p: 3,
          textAlign: "center",
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          position: "relative",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Icono dinámico */}
        <Box sx={{ mb: 2 }}>
          <HourglassEmpty sx={{ fontSize: 48, color: theme.palette.primary.main }} />
        </Box>
      
        <Typography variant="h6" fontWeight={600}>
          ⏳ Tu video está en revisión...
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
          Un pro está analizando tu técnica. Pronto recibirás tu feedback. 🚀
        </Typography>
      
        {/* Barra de progreso minimalista */}
        <LinearProgress
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: theme.palette.grey[200],
          }}
        />
      
        {/* Estado de la revisión */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, opacity: 0.7 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Timer sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
            <Typography variant="caption">Revisión en curso</Typography>
          </Box>
      
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleOutline sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
            <Typography variant="caption">Te avisamos pronto</Typography>
          </Box>
        </Box>
      </Paper>
      )}
    </Box>
  );
};

VideoReviewStatus.propTypes = {
  proCheck: PropTypes.bool.isRequired,
  reviewed: PropTypes.bool.isRequired,
};