import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
//
import Image from './Image';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(8, 2),
}));

// ----------------------------------------------------------------------

EmptyContent.propTypes = {
  title: PropTypes.string,
  img: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  description: PropTypes.string,
};

export default function EmptyContent({ title, description, img, ...other }) {
  const showImage = img !== false;

  return (
    <RootStyle {...other}>
      {showImage && (
        <Image
          disabledEffect
          visibleByDefault
          alt="empty content"
          src={typeof img === 'string' ? img : 'https://i.imgur.com/JndUpOn.png'}
          sx={{ height: 240, mb: 3 }}
        />
      )}

      {title && (
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
      )}

      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      )}
    </RootStyle>
  );
}
