import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import BookingDetailsDrawer from './BookingDetailsDrawer';
import GearBookingDetailsDrawer from './GearBookingDetailsDrawer';

// ----------------------------------------------------------------------

AdminBookingTableRow.propTypes = {
    row: PropTypes.object,
    isGearAdminList: PropTypes.bool,
    onEditRow: PropTypes.func,
    onConfirmRow: PropTypes.func,
    onDeclineRow: PropTypes.func,
    onWapp: PropTypes.func,
    onEvents: PropTypes.func,
    onDeleteRow: PropTypes.func,
    refreshBookings: PropTypes.func,
};

export default function AdminBookingTableRow({
    row,
    isGearAdminList = false,
    onEditRow,
    onConfirmRow,
    onDeclineRow,
    onWapp,
    onEvents,
    onDeleteRow,
    refreshBookings,
}) {
    const theme = useTheme();
    const { t } = useTranslation();
    const [openDrawer, setOpenDrawer] = useState(false);

    const { imageLink, userComment, state, resort, adults, children, eventList, id, price, internalComment, includesLunch, includesEquipments, paymentStatus, type } = row;
    const teacher = row.teacher;
    const { name, lastname, id: teacherId, role, level } = teacher || {};
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

        return t('adminBookings.row.hoursCount', { count: Math.round(totalHours) });
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

    const notesCombined = [internalComment, userComment].filter(Boolean).join(' — ') || '-';

    const rowMenuActions = (
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
    );

    if (isGearAdminList) {
        return (
            <>
                <TableRow
                    hover
                    onClick={handleRowClick}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                        },
                    }}
                >
                    <TableCell align="left">
                        <Typography variant="subtitle2" noWrap>
                            {id}
                        </Typography>
                    </TableCell>

                    <TableCell align="left">
                        <Typography variant="subtitle2" noWrap>
                            {`${studentName || ''} ${studentLastname || ''}`.trim() || '—'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            ID: {studentId ?? '—'}
                        </Typography>
                    </TableCell>

                    <TableCell align="left">
                        <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={
                                (state === 'DECLINED' && 'error') ||
                                (state === 'PENDING' && 'warning') ||
                                'success'
                            }
                            sx={{ textTransform: 'capitalize' }}
                        >
                            {state || '—'}
                        </Label>
                        {type === 'GEAR_ONLY' && (
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                {t('adminBookings.row.equipment')}
                            </Typography>
                        )}
                    </TableCell>

                    <TableCell align="left">{resort || '—'}</TableCell>

                    <TableCell align="left">
                        <Typography variant="subtitle2" color="primary.main">
                            {formatPrice(price)}
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

                    <TableCell align="left" sx={{ maxWidth: 280 }}>
                        <Typography variant="body2" noWrap title={notesCombined}>
                            {notesCombined}
                        </Typography>
                    </TableCell>

                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <TableMoreMenu
                            open={openMenu}
                            onOpen={handleOpenMenu}
                            onClose={handleCloseMenu}
                            actions={rowMenuActions}
                        />
                    </TableCell>
                </TableRow>

                {isGearAdminList ? (
                    <GearBookingDetailsDrawer
                        open={openDrawer}
                        onClose={() => setOpenDrawer(false)}
                        booking={row}
                        refreshBookings={refreshBookings}
                    />
                ) : (
                    <BookingDetailsDrawer
                        open={openDrawer}
                        onClose={() => setOpenDrawer(false)}
                        booking={row}
                        refreshBookings={refreshBookings}
                    />
                )}
            </>
        );
    }

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
                        {teacher ? `${name} ${lastname}` : t('adminBookings.row.gearOnly')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {teacherId != null ? `ID: ${teacherId}` : type === 'GEAR_ONLY' ? t('adminBookings.row.rental') : ''}
                    </Typography>
                </TableCell>

                <TableCell align="left">
                    <Typography variant="subtitle2">
                        {t('adminBookings.row.classesCount', { count: eventList?.length || 0 })}
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
                        {t('adminBookings.row.adultsCount', { count: adults })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {t('adminBookings.row.childrenCount', { count: children })}
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
                        {includesLunch ? t('adminBookings.row.withLunch') : t('adminBookings.row.withoutLunch')}
                        {includesEquipments ? ` ${t('adminBookings.row.withEquipment')}` : ` ${t('adminBookings.row.withoutEquipment')}`}
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
                        actions={rowMenuActions}
                    />
                </TableCell>
            </TableRow>

            {isGearAdminList ? (
                <GearBookingDetailsDrawer
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    booking={row}
                    refreshBookings={refreshBookings}
                />
            ) : (
                <BookingDetailsDrawer
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    booking={row}
                    refreshBookings={refreshBookings}
                />
            )}
        </>
    );
}