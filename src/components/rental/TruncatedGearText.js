import PropTypes from 'prop-types';
import { Typography, Tooltip } from '@mui/material';
import { truncateGearListText } from '../../utils/truncateGearListText';

// ----------------------------------------------------------------------

TruncatedGearText.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.string,
  sx: PropTypes.object,
};

export default function TruncatedGearText({ text, variant = 'body2', sx, ...other }) {
  const { display, full, isTruncated } = truncateGearListText(text);

  const typography = (
    <Typography variant={variant} sx={sx} {...other}>
      {display}
    </Typography>
  );

  if (!isTruncated || !full) {
    return typography;
  }

  return (
    <Tooltip title={full} placement="top" enterDelay={400}>
      {typography}
    </Tooltip>
  );
}
