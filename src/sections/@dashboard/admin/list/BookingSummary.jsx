import PropTypes from 'prop-types';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// @mui
import { Box, Card, Grid, Typography, Stack, IconButton, Divider } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
// components
import Iconify from '../../../../components/Iconify';
import TeacherLevelHourRatesBar from '../financial/TeacherLevelHourRatesBar';
import { calcTeacherPayTotalWithLevelPrices } from '../../../../utils/teacherPayoutAmount';
import { buildDefaultLevelHourPrices } from '../../../../utils/teacherHourPricePresets';
import { getUniqueHoursFromBookings } from '../../../../utils/calendarEventStats';

// ----------------------------------------------------------------------

const GEAR_HIDDEN_KEYS = new Set([
    'assignedHours',
    'requiredHours',
    'totalHours',
    'totalAdults',
    'totalChildren',
]);

function sumRevenueByCurrency(bookings) {
    const totals = {};
    (bookings || []).forEach((booking) => {
        const currency = booking?.currency || 'ARS';
        totals[currency] = (totals[currency] || 0) + (Number(booking?.price) || 0);
    });
    return Object.entries(totals).sort(([a], [b]) => {
        if (a === 'ARS') return -1;
        if (b === 'ARS') return 1;
        return a.localeCompare(b);
    });
}

function formatCurrencyAmount(amount, currency = 'ARS') {
    try {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
        }).format(amount || 0);
    } catch {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    }
}

BookingSummary.propTypes = {
    bookings: PropTypes.array,
    /** When true (admin /bookings/equipos), hide class-hour and capacity stats that do not apply to gear-only bookings. */
    isGearBookings: PropTypes.bool,
};

export default function BookingSummary({ bookings, isGearBookings = false }) {
    const theme = useTheme();
    const { t } = useTranslation();
    const [showRevenue, setShowRevenue] = useState(false);
    const [levelPrices, setLevelPrices] = useState(() => buildDefaultLevelHourPrices());

    const handleLevelPriceChange = (levelKey, field, value) => {
        setLevelPrices((prev) => ({
            ...prev,
            [levelKey]: {
                ...prev[levelKey],
                [field]: value,
            },
        }));
    };

    const revenueByCurrency = useMemo(() => {
        const totals = sumRevenueByCurrency(bookings);
        return totals.length ? totals : [['ARS', 0]];
    }, [bookings]);

    const SUMMARY = useMemo(() => {
        const formatPrice = (price) =>
            new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
            }).format(price);

        const formatHours = (hours) => `${Math.round(hours)}h`;

        const stats = {
            total: bookings?.length || 0,
            assignedHours: getUniqueHoursFromBookings(bookings, {
                bookingType: 'ASSIGNED',
                eventType: 'CLASS',
            }),
            requiredHours: getUniqueHoursFromBookings(bookings, {
                bookingType: 'REFERRED',
                eventType: 'REFERRED',
            }),
            totalHours: getUniqueHoursFromBookings(bookings),
            totalAdults: bookings?.reduce((sum, booking) => sum + (booking.adults || 0), 0) || 0,
            totalChildren: bookings?.reduce((sum, booking) => sum + (booking.children || 0), 0) || 0,
            totalTeacherPayments: calcTeacherPayTotalWithLevelPrices(bookings, levelPrices),
        };

        const revenueCards = revenueByCurrency.map(([currency, amount]) => ({
            key: `totalRevenue-${currency}`,
            title: `${t('adminBookings.summary.totalRevenue')} ${currency}`,
            total: formatCurrencyAmount(amount, currency),
            icon: 'eva:trending-up-fill',
            color: theme.palette.info.main,
            isRevenue: true,
        }));

        return [
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
            ...revenueCards,
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
        ];
    }, [t, theme, bookings, levelPrices, revenueByCurrency]);

    const summaryItems = isGearBookings
        ? SUMMARY.filter((item) => !GEAR_HIDDEN_KEYS.has(item.key))
        : SUMMARY;

    return (
        <Card sx={{ p: 3, mb: 3 }}>
            <Stack spacing={3}>
                <TeacherLevelHourRatesBar
                    levelPrices={levelPrices}
                    onLevelPriceChange={handleLevelPriceChange}
                />

                <Divider />

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
            </Stack>
        </Card>
    );
} 