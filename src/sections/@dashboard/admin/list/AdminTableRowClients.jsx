import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Box, Checkbox, TableRow, TableCell, Typography, MenuItem, Tooltip, Stack } from '@mui/material';
// components
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
  onContactedChange: PropTypes.func,
  onClick: PropTypes.func,
};

export default function AdminTableRowClients({ row, selected, onEditRow, onSelectRow, onConfirmRow, onDeclineRow, onWapp, onEvents, onContactedChange, onClick }) {
  const { name, lastname, email, id, cellphone, proCheckCredits, contacted, role } = row;
  const isStudent = String(role || '').toUpperCase() === 'STUDENT';

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    event.stopPropagation();
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

      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title={isStudent ? 'Student' : 'Client'}>
            <Box component="span" sx={{ display: 'inline-flex' }}>
              <Iconify
                icon={isStudent ? 'mdi:school' : 'mdi:account'}
                sx={{
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                  color: isStudent ? 'info.main' : 'text.secondary',
                }}
              />
            </Box>
          </Tooltip>
          <Typography variant="subtitle2" noWrap>
            {name + " " + lastname}
          </Typography>
        </Stack>
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

      {onContactedChange && (
        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={!!contacted}
            onChange={(e) => onContactedChange?.(e.target.checked)}
          />
        </TableCell>
      )}
      
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
                View Details
              </MenuItem>
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
