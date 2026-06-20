import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    isGearAdminList: PropTypes.bool,
    selected: PropTypes.bool,
    onEditRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    onConfirmRow: PropTypes.func,
    onDeclineRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
    onWapp: PropTypes.func,
    onEvents: PropTypes.func,
    refreshBookings: PropTypes.func,
};

export default function AdminBookingTableCard({
    row,
    isGearAdminList = false,
    selected,
    onEditRow,
    onSelectRow,
    onConfirmRow,
    onDeclineRow,
    onWapp,
    onEvents,
    onDeleteRow,
    refreshBookings,
}) {
    const theme = useTheme();
    const { t } = useTranslation();
    
    const { imageLink, userComment, state, resort, adults, children, eventList, id, price, internalComment, type } = row;
    const teacher = row.teacher;
    const { name, lastname, id: teacherId } = teacher || {};
    const { name: studentName, lastname: studentLastname, id: studentId } = row.student || {};

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
                            {t('adminBookings.card.bookingTitle', { id })}
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
                                {!isGearAdminList && eventList?.length > 0 && (
                                <MenuItem
                                    onClick={() => {
                                        onEvents();
                                        handleCloseMenu();
                                    }}
                                >
                                    <Iconify icon={'eva:calendar-fill'} />
                                    {t('adminBookings.menu.viewCalendar')}
                                </MenuItem>
                                )}
                                <MenuItem
                                    onClick={() => {
                                        onWapp();
                                        handleCloseMenu();
                                    }}
                                >
                                    <Iconify icon={'mdi:whatsapp'} />
                                    {t('adminBookings.menu.whatsapp')}
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        onEditRow();
                                        handleCloseMenu();
                                    }}
                                >
                                    <Iconify icon={'eva:edit-fill'} />
                                    {t('adminBookings.menu.edit')}
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        onDeleteRow();
                                        handleCloseMenu();
                                    }}
                                    sx={{ color: 'error.main' }}
                                >
                                    <Iconify icon={'eva:trash-2-outline'} />
                                    {t('adminBookings.menu.delete')}
                                </MenuItem>
                            </>
                        }
                    />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        {t('adminBookings.card.client')}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        {`${studentName} ${studentLastname}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                        ID: {studentId}
                    </Typography>
                </Box>

                {!isGearAdminList && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        {t('adminBookings.card.instructor')}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        {teacher ? `${name} ${lastname}` : t('adminBookings.row.gearOnly')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                        {teacherId != null ? `ID: ${teacherId}` : ''}
                    </Typography>
                </Box>
                )}

                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        {isGearAdminList ? t('adminBookings.card.gearDetails') : t('adminBookings.card.bookingDetails')}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                        {!isGearAdminList && (
                        <>
                        <Typography variant="body2">
                            {t('adminBookings.row.classesCount', { count: eventList?.length || 0 })}
                        </Typography>
                        <Typography variant="body2">
                            {getDateRange()}
                        </Typography>
                        </>
                        )}
                        <Typography variant="body2">
                            {resort}
                        </Typography>
                        {!isGearAdminList && (
                        <Typography variant="body2">
                            {t('adminBookings.card.adultsChildren', { adults, children })}
                        </Typography>
                        )}
                        {isGearAdminList && type === 'GEAR_ONLY' && (
                            <Typography variant="caption" color="text.secondary">
                                {t('adminBookings.card.gearOnlyNote')}
                            </Typography>
                        )}
                        <Typography variant="body2" color="primary.main">
                            {formatPrice(price)}
                        </Typography>
                        {(internalComment || userComment) && (
                            <Typography variant="body2" color="text.secondary">
                                {[internalComment, userComment].filter(Boolean).join(' — ')}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </Card>
    );
}
