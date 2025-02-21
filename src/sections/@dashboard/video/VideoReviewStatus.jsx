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
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            boxShadow: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Icono dinámico */}
          <Box sx={{ mb: 2 }}>
            <HourglassEmpty sx={{ fontSize: 50, color: "white" }} />
          </Box>

          <Typography variant="h6" gutterBottom fontWeight="bold">
            ⏳ Tu video está en revisión...
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
            Un pro está analizando tu técnica. Pronto recibirás tu feedback. 🚀
          </Typography>

          {/* Barra de progreso */}
          <LinearProgress sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(255,255,255,0.3)" }} />

          {/* Estado de la revisión */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, opacity: 0.9 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)", width: 24, height: 24 }}>
                <Timer sx={{ fontSize: 16, color: "white" }} />
              </Avatar>
              <Typography variant="caption">Revisión en curso</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)", width: 24, height: 24 }}>
                <CheckCircleOutline sx={{ fontSize: 16, color: "white" }} />
              </Avatar>
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