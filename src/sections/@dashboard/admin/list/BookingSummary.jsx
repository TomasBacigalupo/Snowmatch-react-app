import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Box, Card, Grid, Typography, Stack, IconButton } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

BookingSummary.propTypes = {
    bookings: PropTypes.array,
};

export default function BookingSummary({ bookings }) {
    const theme = useTheme();
    const [showRevenue, setShowRevenue] = useState(false);

    const calculateHours = (events) => {
        if (!events?.length) return 0;
        return events.reduce((total, event) => {
            const start = new Date(event.start);
            const end = new Date(event.end);
            const hours = (end - start) / (1000 * 60 * 60);
            return total + hours;
        }, 0);
    };

    const calculateHoursByType = (events, type) => {
        if (!events?.length) return 0;
        return events.reduce((total, event) => {
            if (event.eventType === type) {
                const start = new Date(event.start);
                const end = new Date(event.end);
                const hours = (end - start) / (1000 * 60 * 60);
                return total + hours;
            }
            return total;
        }, 0);
    };

    const stats = {
        total: bookings?.length || 0,
        assignedHours: bookings?.reduce((sum, booking) => 
            sum + calculateHoursByType(booking.eventList, 'ASIGNED'), 0) || 0,
        requiredHours: bookings?.reduce((sum, booking) => 
            sum + calculateHoursByType(booking.eventList, 'REQUIRED'), 0) || 0,
        totalRevenue: bookings?.reduce((sum, booking) => sum + (booking.price || 0), 0) || 0,
        totalHours: bookings?.reduce((sum, booking) => 
            sum + calculateHours(booking.eventList), 0) || 0,
        totalAdults: bookings?.reduce((sum, booking) => sum + (booking.adults || 0), 0) || 0,
        totalChildren: bookings?.reduce((sum, booking) => sum + (booking.children || 0), 0) || 0,
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

    const SUMMARY = [
        {
            title: 'Total Reservas',
            total: stats.total,
            icon: 'eva:file-text-fill',
            color: theme.palette.primary.main,
        },
        {
            title: 'Horas Asignadas',
            total: formatHours(stats.assignedHours),
            icon: 'eva:clock-fill',
            color: theme.palette.warning.main,
        },
        {
            title: 'Horas Requeridas',
            total: formatHours(stats.requiredHours),
            icon: 'eva:calendar-fill',
            color: theme.palette.success.main,
        },
        {
            title: 'Total Horas',
            total: formatHours(stats.totalHours),
            icon: 'eva:time-fill',
            color: theme.palette.info.main,
        },
        {
            title: 'Ingresos Totales',
            total: formatPrice(stats.totalRevenue),
            icon: 'eva:trending-up-fill',
            color: theme.palette.info.main,
            isRevenue: true,
        },
        {
            title: 'Total Adultos',
            total: stats.totalAdults,
            icon: 'eva:people-fill',
            color: theme.palette.success.dark,
        },
        {
            title: 'Total Niños',
            total: stats.totalChildren,
            icon: 'eva:person-fill',
            color: theme.palette.warning.dark,
        },
    ];

    return (
        <Card sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
                {SUMMARY.map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item.title}>
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