import PropTypes from 'prop-types';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// @mui
import { Box, Card, Grid, Typography, Stack, IconButton } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const GEAR_HIDDEN_KEYS = new Set([
    'assignedHours',
    'requiredHours',
    'totalHours',
    'totalAdults',
    'totalChildren',
]);

BookingSummary.propTypes = {
    bookings: PropTypes.array,
    /** When true (admin /bookings/equipos), hide class-hour and capacity stats that do not apply to gear-only bookings. */
    isGearBookings: PropTypes.bool,
};

export default function BookingSummary({ bookings, isGearBookings = false }) {
    const theme = useTheme();
    const { t } = useTranslation();
    const [showRevenue, setShowRevenue] = useState(false);

    const calculateHours = (events) => {
        if (!events?.length) return 0;
        return events.reduce((total, event) => {
            const start = new Date(event.start);
            const end = new Date(event.end);
            const hours = (end - start) / (1000 * 60 * 60);
            if (hours == 4){
                return total + 3;
            }
            return total + Math.min(hours, 6);
        }, 0);
    };

    const calculateHoursByType = (events, type) => {
        if (!events?.length) return 0;
        return events.reduce((total, event) => {
            if (event.eventType === type) {
                const start = new Date(event.start);
                const end = new Date(event.end);
                const hours = (end - start) / (1000 * 60 * 60);
                if (hours == 4){
                    return total + 3;
                }
                return total + Math.min(hours, 6);
            }
            return total;
        }, 0);
    };

    const calculateTeacherPayments = () => {
        if (!bookings?.length) return 0;
        
        return bookings.reduce((total, booking) => {
            if (!booking.teacher?.level || !booking.eventList?.length) return total;
            
            const teacherLevel = booking.teacher.level;
            let hourlyRate = 0;
            
            // Definir tarifa por nivel
            switch (teacherLevel) {
                case 1:
                    if(booking.type === 'REFERRED'){
                        hourlyRate = 30000;
                    } else {
                        hourlyRate = 23500;
                    }
                    break;
                case 2:
                    if(booking.type === 'REFERRED'){
                        hourlyRate = 38500;
                    } else {
                        hourlyRate = 32000;
                    }
                    break;
                case 3:
                case 4:
                case 5:
                    if(booking.type === 'REFERRED'){
                        hourlyRate = 56000;
                    } else {
                        hourlyRate = 49500;
                    }
                    
                    break;
                default:
                    hourlyRate = 16000; // Default para niveles no especificados
            }
            
            // Calcular horas totales del teacher en esta reserva
            const teacherHours = booking.eventList.reduce((hours, event) => {
                const start = new Date(event.start);
                const end = new Date(event.end);
                const eventHours = (end - start) / (1000 * 60 * 60);
                if (eventHours == 4) {
                    return hours + 3;
                }
                return hours + Math.min(eventHours, 6);
            }, 0);
            
            return total + (teacherHours * hourlyRate);
        }, 0);
    };

    const stats = {
        total: bookings?.length || 0,
        assignedHours: bookings?.filter(booking => booking.type === 'ASSIGNED').reduce((sum, booking) => 
            sum + calculateHoursByType(booking.eventList, 'CLASS'), 0) || 0,
        requiredHours: bookings?.filter(booking => booking.type === 'REFERRED').reduce((sum, booking) => 
            sum + calculateHoursByType(booking.eventList, 'REFERRED'), 0) || 0,
        totalRevenue: bookings?.reduce((sum, booking) => sum + (booking.price || 0), 0) || 0,
        totalHours: bookings?.reduce((sum, booking) => 
            sum + calculateHours(booking.eventList), 0) || 0,
        totalAdults: bookings?.reduce((sum, booking) => sum + (booking.adults || 0), 0) || 0,
        totalChildren: bookings?.reduce((sum, booking) => sum + (booking.children || 0), 0) || 0,
        totalTeacherPayments: calculateTeacherPayments(),
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(price);
    };

    const formatHours = (hours) => {
        return `${Math.round(hours)}h`;
    };

    const SUMMARY = useMemo(() => [
        {
            key: 'totalBookings',
            title: t('adminBookings.summary.totalBookings'),
            total: stats.total,
            icon: 'eva:file-text-fill',
            color: theme.palette.primary.main,
        },
        {
            key: 'assignedHours',
            title: t('adminBookings.summary.assignedHours'),
            total: formatHours(stats.assignedHours),
            icon: 'eva:clock-fill',
            color: theme.palette.warning.main,
        },
        {
            key: 'requiredHours',
            title: t('adminBookings.summary.requiredHours'),
            total: formatHours(stats.requiredHours),
            icon: 'eva:calendar-fill',
            color: theme.palette.success.main,
        },
        {
            key: 'totalHours',
            title: t('adminBookings.summary.totalHours'),
            total: formatHours(stats.totalHours),
            icon: 'eva:time-fill',
            color: theme.palette.info.main,
        },
        {
            key: 'totalRevenue',
            title: t('adminBookings.summary.totalRevenue'),
            total: formatPrice(stats.totalRevenue),
            icon: 'eva:trending-up-fill',
            color: theme.palette.info.main,
            isRevenue: true,
        },
        {
            key: 'totalPayments',
            title: t('adminBookings.summary.totalPayments'),
            total: formatPrice(stats.totalTeacherPayments),
            icon: 'eva:credit-card-fill',
            color: theme.palette.error.main,
            isRevenue: true,
        },
        {
            key: 'totalAdults',
            title: t('adminBookings.summary.totalAdults'),
            total: stats.totalAdults,
            icon: 'eva:people-fill',
            color: theme.palette.success.dark,
        },
        {
            key: 'totalChildren',
            title: t('adminBookings.summary.totalChildren'),
            total: stats.totalChildren,
            icon: 'eva:person-fill',
            color: theme.palette.warning.dark,
        },
    ], [t, theme, stats]);

    const summaryItems = isGearBookings
        ? SUMMARY.filter((item) => !GEAR_HIDDEN_KEYS.has(item.key))
        : SUMMARY;

    return (
        <Card sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
                {summaryItems.map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item.key}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            sx={{
                                p: 2,
                                borderRadius: 1,
                                bgcolor: alpha(item.color, 0.08),
                                position: 'relative',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: alpha(item.color, 0.16),
                                }}
                            >
                                <Iconify
                                    icon={item.icon}
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        color: item.color,
                                    }}
                                />
                            </Box>

                            <Stack spacing={0.5} sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                    {item.title}
                                </Typography>
                                {item.isRevenue ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography variant="h6">
                                            {showRevenue ? item.total : '••••••••'}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => setShowRevenue(!showRevenue)}
                                            sx={{
                                                color: item.color,
                                                '&:hover': {
                                                    bgcolor: alpha(item.color, 0.16),
                                                },
                                            }}
                                        >
                                            <Iconify
                                                icon={showRevenue ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                                                sx={{ width: 20, height: 20 }}
                                            />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Typography variant="h6">{item.total}</Typography>
                                )}
                            </Stack>
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </Card>
    );
} 