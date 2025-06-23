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

AdminTableRowClients.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onWapp: PropTypes.func,
  onEvents: PropTypes.func,
  onClick: PropTypes.func,
};

export default function AdminTableRowClients({ row, selected, onEditRow, onSelectRow, onConfirmRow, onDeclineRow, onWapp, onEvents, onClick }) {
  const theme = useTheme();

  const { name, lastname, email, state, id, cellphone, proCheckCredits } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow 
      hover 
      selected={selected}
      onClick={onClick}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell padding="checkbox">
      {id}
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={"imageLink"} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name + " " + lastname}
        </Typography>
      </TableCell>
      <TableCell align="left">
        {cellphone}
      </TableCell>

      <TableCell align="left">
        {email}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {proCheckCredits}
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
