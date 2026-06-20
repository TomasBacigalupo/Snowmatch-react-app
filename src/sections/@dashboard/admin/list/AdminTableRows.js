import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

AdminTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onWapp: PropTypes.func,
  onEvents: PropTypes.func,
  onClick: PropTypes.func,
};

export default function AdminTableRow({ row, onEditRow, onConfirmRow, onDeclineRow, onWapp, onEvents, onClick }) {
  const { t } = useTranslation();
  const theme = useTheme();

  const { name, lastname, imageLink, level, authorized, isAuthorized, state, id } = row;
  const isAuth = authorized || isAuthorized || row.isauthorized;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    event.stopPropagation();
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover onClick={onClick} sx={{ cursor: 'pointer' }}>
      <TableCell align="left">
        {id}
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={`${name} ${lastname}`.trim()} src={imageLink} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name + " " + lastname}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {level}
      </TableCell>

      <TableCell align="center">
        <Iconify
          icon={isAuth ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
          sx={{
            width: 20,
            height: 20,
            color: isAuth ? 'success.main' : 'warning.main',
          }}
        />
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(state === 'UNAVAILABLE' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {state}
        </Label>
      </TableCell>
      
      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              {/* <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem> */}
              {/* <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem> */}
              <MenuItem
                onClick={() => {
                  onClick();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:eye-fill'} />
                {t('adminReview.menu.viewDetails')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEvents();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:calendar-fill'} />
                {t('adminReview.menu.events')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onWapp();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'mdi:whatsapp'} />
                {t('adminReview.menu.wapp')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onConfirmRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                {t('adminReview.menu.edit')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeclineRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                {t('adminReview.menu.decline')}
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
