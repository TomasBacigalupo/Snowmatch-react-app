import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { useMediaQuery } from 'react-responsive';
import { useDispatch } from '../../../../redux/store';
import { selectClient } from '../../../../redux/slices/clients'
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { useNavigate } from 'react-router-dom';



// ----------------------------------------------------------------------
 
ClientTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};



export default function ClientTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id, name, lastname, email, cellphone, level } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  if(isMobile){
  return (
    <TableRow hover selected={selected}>
      <TableCell  sx={{  alignItems: 'center' }} >
        <Checkbox checked={selected} onClick={onSelectRow} />

      </TableCell>
      <TableCell  sx={{  alignItems: 'center' }} onClick={() => {dispatch(selectClient(id)); navigate(PATH_DASHBOARD.user.edit("client"));}}>
                <Avatar alt={name} src="" sx={{ mr: 1 }} />

      </TableCell>

      <TableCell align="left" onClick={() => {dispatch(selectClient(id)); navigate(PATH_DASHBOARD.user.edit("client"));}}>
        <Typography variant="subtitle2" noWrap>
          {name +" " +lastname}
        </Typography>
                <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'ghost'}
          color={(level === 'EXPERT' && 'error') || (level === 'BEGINNER' && 'success') || (level === 'INTERMEDIATE' && 'secondary') || 'warning'}
          sx={{ textTransform: 'capitalize' }}
        >
          {level}
        </Label>
        <br/>
        {cellphone}
      </TableCell>



      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
if(!isMobile){
  return (
    <TableRow hover selected={selected} >
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }} onClick={() => {dispatch(selectClient(id)); navigate(PATH_DASHBOARD.user.edit("client"));}}>
        <Avatar alt={name} sx={{ mr: 2 }}> {name[0] + lastname[0]}</Avatar>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell align="left" onClick={() => {dispatch(selectClient(id)); navigate(PATH_DASHBOARD.user.edit("client"));}}>{lastname}</TableCell>

      <TableCell align="left" onClick={() => {dispatch(selectClient(id)); navigate(PATH_DASHBOARD.user.edit("client"));}}>{email}</TableCell>


      <TableCell align="left" sx={{ textTransform: 'capitalize' }} onClick={() => {dispatch(selectClient(id)); navigate(PATH_DASHBOARD.user.edit("client"));}}>
        {cellphone}
      </TableCell>

      <TableCell align="left" onClick={() => {dispatch(selectClient(id)); navigate(PATH_DASHBOARD.user.edit("client"));}}>
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'ghost'}
          color={(level === 'EXPERT' && 'error') || (level === 'BEGINNER' && 'success') || (level === 'INTERMEDIATE' && 'secondary') || 'warning'}
          sx={{ textTransform: 'capitalize' }}
        >
          {level}
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
}
