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

AdminBookingTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onEditRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onWapp: PropTypes.func,
    onEvents: PropTypes.func,
};

export default function AdminBookingTableRow({ row, selected, onEditRow, onSelectRow, onConfirmRow, onDeclineRow, onWapp, onEvents }) {
    const theme = useTheme();

    const { imageLink, userComment, state, resort, adults, children, eventList, id } = row;
    const { name, lastname, id: teacherId, role, level } = row.teacher;
    const { name: studentName, lastname: studentLastname, id: studentId } = row.student;



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

            <TableCell align="left">
                <Typography variant="subtitle2" noWrap>
                    {id}
                </Typography>
            </TableCell>

            <TableCell align="left">
                <Typography variant="subtitle2" noWrap>
                    {`${studentName} ${studentLastname} - ${studentId}`}
                </Typography>
            </TableCell>

            <TableCell id='student'>
                <Typography variant="subtitle2" noWrap>
                    {`${name} ${lastname} - ${teacherId}`}
                </Typography>
            </TableCell>

            
            <TableCell align="left">
                {eventList.length}
            </TableCell>
            <TableCell align="left">
                {resort}
            </TableCell>
            <TableCell align="left">
                {adults}
            </TableCell>
            <TableCell align="left">
                {children}
            </TableCell>
            
            <TableCell align="left">
                {userComment}
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
                            <MenuItem
                                onClick={() => {
                                    onEvents();
                                    handleCloseMenu();
                                }}
                            >
                                <Iconify icon={'eva:calendar-fill'} />
                                Ver clases en el calendario
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    onWapp();
                                    handleCloseMenu();
                                }}
                            >
                                <Iconify icon={'mdi:whatsapp'} />
                                Contactár por Whats app
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    onEditRow();
                                    handleCloseMenu();
                                }}
                            >
                                <Iconify icon={'eva:edit-fill'} />
                                Editar
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    onDeclineRow();
                                    handleCloseMenu();
                                }}
                                sx={{ color: 'error.main' }}
                            >
                                <Iconify icon={'eva:trash-2-outline'} />
                                Eliminar
                            </MenuItem>
                        </>
                    }
                />
            </TableCell>
        </TableRow>
    );
}