// @mui
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
//
import EmptyContent from '../EmptyContent';

// ----------------------------------------------------------------------

TableNoData.propTypes = {
  isNotFound: PropTypes.bool,
  title: PropTypes.string,
  hideImage: PropTypes.bool,
};

export default function TableNoData({
  isNotFound,
  title = "You don't have Clients. Go and create!",
  hideImage = false,
}) {
  return (
    <>
      {isNotFound ? (
        <TableRow>
          <TableCell colSpan={9}>
            <EmptyContent
              title={title}
              img={hideImage ? false : undefined}
              sx={
                hideImage
                  ? {
                      py: 4,
                      '& .MuiTypography-h5': {
                        typography: 'body1',
                        color: 'text.secondary',
                        fontWeight: 400,
                        maxWidth: 480,
                        mx: 'auto',
                      },
                    }
                  : { '& span.MuiBox-root': { height: 160 } }
              }
            />
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell colSpan={9} sx={{ p: 0 }} />
        </TableRow>
      )}
    </>
  );
}
