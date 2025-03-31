import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography, Box, Button } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import ReactApexChart from "react-apexcharts";
import { merge } from 'lodash';
import BaseOptionChart from "../../../../components/chart/BaseOptionChart";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // background: `linear-gradient(to bottom, #fff, ${theme.palette.primary.light})`, // De blanco a primary.light
    color: theme.palette.primary.darker,
    position: 'relative',
    borderRadius: '0px',
    height: 200, // Aumenté un poco la altura para el botón
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(3),
    left: theme.spacing(3),
    width: theme.spacing(6),
    height: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0px',
    backgroundColor: alpha(theme.palette.primary.dark, 0.2),
}));

const ChartContainer = styled('div')({
    position: 'absolute',
    bottom: 80, // Ajustado para que no choque con el botón
    right: 10,
    width: 150,
    height: 60,
});

const LeaderboardButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(1),
    alignSelf: 'center',
}));

// ----------------------------------------------------------------------

AnalyticsChallangeWidget.propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string,
    total: PropTypes.number,
    percentage: PropTypes.number,
    chartData: PropTypes.arrayOf(PropTypes.number),
    onLeaderboardClick: PropTypes.func, // Prop para manejar clic en el botón
};

export default function AnalyticsChallangeWidget({ title, total, icon, percentage, chartData, onLeaderboardClick }) {
    const lineChartOptions = merge(BaseOptionChart(), {
        chart: { sparkline: { enabled: true } },
        stroke: { width: 3 },
    });

    return (
        <RootStyle>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                {title}
            </Typography>
            <Typography variant="h3">{total.toLocaleString()}</Typography>
            {/* <Box sx={{ position: 'absolute', top: '0px', right: '15px', display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Iconify icon="eva:trending-up-fill" width={16} height={16} />
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    +{percentage}%
                </Typography>
            </Box> */}
            <ChartContainer>
                <ReactApexChart options={lineChartOptions} series={[{ data: chartData }]} type="line" height={50} />
            </ChartContainer>
            <LeaderboardButton variant="outlined" fullWidth size="small" onClick={onLeaderboardClick}>
                Leaderboard
            </LeaderboardButton>
        </RootStyle>
    );
}