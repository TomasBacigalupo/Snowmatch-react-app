import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import BookingDetailsDrawer from './BookingDetailsDrawer';

// ----------------------------------------------------------------------

AdminBookingTableRow.propTypes = {
    row: PropTypes.object,
    onEditRow: PropTypes.func,
    onConfirmRow: PropTypes.func,
    onDeclineRow: PropTypes.func,
    onWapp: PropTypes.func,
    onEvents: PropTypes.func,
    onDeleteRow: PropTypes.func,
    refreshBookings: PropTypes.func,
};

export default function AdminBookingTableRow({ row, onEditRow, onConfirmRow, onDeclineRow, onWapp, onEvents, onDeleteRow, refreshBookings }) {
    const theme = useTheme();
    const [openDrawer, setOpenDrawer] = useState(false);

    const { imageLink, userComment, state, resort, adults, children, eventList, id, price, internalComment, includesLunch, includesEquipments, paymentStatus } = row;
    const { name, lastname, id: teacherId, role, level } = row.teacher;
    const { name: studentName, lastname: studentLastname, id: studentId } = row.student;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getDateRange = () => {
        if (!eventList?.length) return '-';
        const dates = eventList.map(event => new Date(event.end));
        const start = new Date(Math.min(...dates));
        const end = new Date(Math.max(...dates));
        return `${formatDate(start)} - ${formatDate(end)}`;
    };

    const getHours = () => {
        if (!eventList?.length) return '-';

        let totalHours = 0;

        eventList.forEach(event => {
            const start = new Date(event.start);
            const end = new Date(event.end);
            const durationInHours = (end - start) / (1000 * 60 * 60); // Convertir milisegundos a horas
            console.log({ durationInHours }, { event });
            if (durationInHours == 4) {
                totalHours += 3;
                console.log('3hs');
            } else if (durationInHours > 5) {
                totalHours += 6;
                console.log('6hs');
            } else {
                totalHours += durationInHours;
                console.log('otro');
            }
        });

        return `${Math.round(totalHours)} hs`;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    };

    const [openMenu, setOpenMenuActions] = useState(null);

    const handleOpenMenu = (event) => {
        event.stopPropagation();
        setOpenMenuActions(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpenMenuActions(null);
    };

    const handleRowClick = (event) => {
        // Prevent click if clicking on menu
        if (event.target.closest('.MuiIconButton-root')) {
            return;
        }
        setOpenDrawer(true);
    };

    return (
        <>
            <TableRow
                hover
                onClick={handleRowClick}
                sx={{
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    }
                }}
            >
                <TableCell align="left">
                    <Typography variant="subtitle2" noWrap>
                        {id}
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="subtitle2" noWrap>
                        {`${studentName} ${studentLastname}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        ID: {studentId}
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="subtitle2" noWrap>
                        {`${name} ${lastname}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        ID: {teacherId}
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="subtitle2">
                        {eventList?.length || 0} clases
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="subtitle2">
                        {getHours()}
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="subtitle2">
                        {getDateRange()}
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    {resort}
                </TableCell>

                <TableCell align="left">
                    <Typography variant="subtitle2">
                        {adults} adultos
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {children} niños
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="subtitle2" color="primary.main">
                        {formatPrice(price)}
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="body2" noWrap>
                        {internalComment || '-'}
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="body2">
                        {includesLunch ? '✓ Almuerzo' : '✗ Sin almuerzo'}
                        {includesEquipments ? ' ✓ Equipo' : ' ✗ Sin equipo'}
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={
                            (paymentStatus === 'PENDING' && 'warning') ||
                            (paymentStatus === 'PAID' && 'success') ||
                            'error'
                        }
                        sx={{ textTransform: 'capitalize' }}
                    >
                        {paymentStatus || 'PENDING'}
                    </Label>
                </TableCell>

                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
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
                                        onDeleteRow();
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

            <BookingDetailsDrawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                booking={row}
                refreshBookings={refreshBookings}
            />
        </>
    );
}