import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

AdminTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onWapp: PropTypes.func,
  onEvents: PropTypes.func,
};

export default function AdminTableRow({ row, selected, onEditRow, onSelectRow, onConfirmRow, onDeclineRow, onWapp, onEvents }) {
  const theme = useTheme();

  const { name, lastname, imageLink, role, level, authorized, state, id } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={"imageLink"} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name + " " + lastname}
        </Typography>
      </TableCell>
      <TableCell align="left">
        {id}
      </TableCell>

      <TableCell align="left">
        {role}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {level}
      </TableCell>

      <TableCell align="center">
        <Iconify
          //todo verificar que funcione con cambios de back
          icon={authorized ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
          sx={{
            width: 20,
            height: 20,
            color: 'success.main',
            ...(!authorized && { color: 'warning.main' }),
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
                  onEvents();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:calendar-fill'} />
                Events
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onWapp();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'mdi:whatsapp'} />
                Wapp
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onConfirmRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeclineRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Decline
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
