import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem, Box, Card } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

AdminBookingTableCard.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onEditRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    onConfirmRow: PropTypes.func,
    onDeclineRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onWapp: PropTypes.func,
    onEvents: PropTypes.func,
};

export default function AdminBookingTableCard({ row, selected, onEditRow, onSelectRow, onConfirmRow, onDeclineRow, onWapp, onEvents, onDeleteRow }) {
    const theme = useTheme();

    const { imageLink, userComment, state, resort, adults, children, eventList, id, price } = row;
    const { name, lastname, id: teacherId } = row.teacher;
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    };

    const [openMenu, setOpenMenuActions] = useState(null);

    const handleOpenMenu = (event) => {
        setOpenMenuActions(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpenMenuActions(null);
    };

    return (
        <Card sx={{ width: '100%', my: 0.5 }}>
            <Box display='flex' padding={2} flexDirection='column'>
                <Box display='flex' justifyContent='space-between' alignItems="flex-start">
                    <Box display='flex' flexDirection='column'>
                        <Typography variant='h6' gutterBottom>
                            Reserva #{id}
                        </Typography>
                        <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={
                                (state === 'DECLINED' && 'error') ||
                                (state === 'PENDING' && 'warning') ||
                                'success'
                            }
                            sx={{ textTransform: 'capitalize', mb: 1 }}
                        >
                            {state}
                        </Label>
                    </Box>

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
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Cliente
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        {`${studentName} ${studentLastname}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                        ID: {studentId}
                    </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Instructor
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        {`${name} ${lastname}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                        ID: {teacherId}
                    </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Detalles de la Reserva
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography variant="body2">
                            {`${eventList?.length || 0} clases`}
                        </Typography>
                        <Typography variant="body2">
                            {getDateRange()}
                        </Typography>
                        <Typography variant="body2">
                            {resort}
                        </Typography>
                        <Typography variant="body2">
                            {`${adults} adultos, ${children} niños`}
                        </Typography>
                        <Typography variant="body2" color="primary.main">
                            {formatPrice(price)}
                        </Typography>
                        {userComment && (
                            <Typography variant="body2" color="text.secondary">
                                {userComment}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </Card>
    );
}
