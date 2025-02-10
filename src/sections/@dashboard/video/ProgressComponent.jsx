import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, LinearProgress, Typography } from "@mui/material";

const phrases = [
  "Snowmatch AI está analizando tu ejercicio",
  "Buscando un Pro para que revise las correcciones",
  "Procesando video"
];

const ProgressComponent = ({ _progress }) => {
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => {
        const nextIndex = (phrases.indexOf(prev) + 1) % phrases.length;
        return phrases[nextIndex];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    _progress > 0 && (
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <LinearProgress
          variant="determinate"
          sx={{ width: "100%" }}
          valueBuffer={_progress}
          value={_progress}
        />
        <Typography textAlign="center" variant="body1">
          {currentPhrase}
        </Typography>
      </Box>
    )
  );
};

ProgressComponent.propTypes = {
  _progress: PropTypes.number.isRequired
};

export default ProgressComponent;