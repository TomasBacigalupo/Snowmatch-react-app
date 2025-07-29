import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Typography, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.success.main,
  backgroundColor: alpha(theme.palette.success.main, 0.16),
}));

// ----------------------------------------------------------------------

BookedHoursChart.propTypes = {
  events: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default function BookedHoursChart({ events = [], isLoading = false }) {
  const theme = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Available months: June (5), July (6), August (7), September (8)
  const availableMonths = [
    { value: 5, label: 'Junio' },
    { value: 6, label: 'Julio' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Septiembre' },
  ];

  // Calculate hours by type for the selected month
  const chartData = useMemo(() => {
    if (!events || events.length === 0) {
      // Sample data for testing when no events exist
      const daysInMonth = new Date(new Date().getFullYear(), selectedMonth + 1, 0).getDate();
      const sampleReferred = Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 4) + 1);
      const sampleAssigned = Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 3) + 1);
      
      return {
        referred: sampleReferred,
        assigned: sampleAssigned,
        totalReferred: sampleReferred.reduce((a, b) => a + b, 0),
        totalAssigned: sampleAssigned.reduce((a, b) => a + b, 0),
      };
    }

    const daysInMonth = new Date(new Date().getFullYear(), selectedMonth + 1, 0).getDate();
    const referredHours = new Array(daysInMonth).fill(0);
    const assignedHours = new Array(daysInMonth).fill(0);
    
    let totalReferred = 0;
    let totalAssigned = 0;

    events.forEach(event => {
      if (event.start && event.end) {
        const eventDate = new Date(event.start);
        const eventMonth = eventDate.getMonth();
        
        if (eventMonth === selectedMonth) {
          const day = eventDate.getDate() - 1; // Array is 0-indexed
          const start = new Date(event.start);
          const end = new Date(event.end);
          const hours = (end - start) / (1000 * 60 * 60);
          
          // Normalize hours (max 6 hours per day)
          const normalizedHours = hours === 4 ? 3 : Math.min(hours, 6);
          
          // Check for REFERRED type or any other type as assigned
          if (event.eventType === 'REFERRED' || event.title === 'Referida') {
            referredHours[day] += normalizedHours;
            totalReferred += normalizedHours;
          } else {
            assignedHours[day] += normalizedHours;
            totalAssigned += normalizedHours;
          }
        }
      }
    });

    return {
      referred: referredHours,
      assigned: assignedHours,
      totalReferred,
      totalAssigned,
    };
  }, [events, selectedMonth]);

  const chartOptions = {
    chart: { 
      sparkline: { enabled: false },
      toolbar: { show: false },
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    plotOptions: { 
      bar: { 
        columnWidth: '60%', 
        borderRadius: 4,
        horizontal: false,
      } 
    },
    dataLabels: { enabled: false },
    stroke: { width: 2 },
    xaxis: {
      categories: Array.from({ length: new Date(new Date().getFullYear(), selectedMonth + 1, 0).getDate() }, (_, i) => i + 1),
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    grid: {
      show: false,
    },
    tooltip: {
      x: { show: true },
      y: {
        formatter: (seriesName) => fNumber(seriesName) + 'h',
        title: {
          formatter: () => 'Horas',
        },
      },
      marker: { show: false },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '12px',
      markers: {
        width: 12,
        height: 12,
        radius: 6,
      },
    },
  };

  const series = [
    {
      name: 'Referidas',
      data: chartData.referred,
    },
    {
      name: 'Asignadas',
      data: chartData.assigned,
    },
  ];

  const totalHours = chartData.totalReferred + chartData.totalAssigned;

  return (
    <Card sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Horas Reservadas por Mes
          {(!events || events.length === 0) && (
            <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
              (Datos de ejemplo)
            </Typography>
          )}
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Mes</InputLabel>
          <Select
            value={selectedMonth}
            label="Mes"
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {availableMonths.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconWrapperStyle>
          <Iconify width={16} height={16} icon="mdi:clock" />
        </IconWrapperStyle>
        <Typography variant="h3">{fNumber(totalHours)}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          horas totales
        </Typography>
      </Stack>

      <Box sx={{ mt: 2 }}>
        <ReactApexChart 
          type="bar" 
          series={series} 
          options={chartOptions} 
          height={120} 
        />
      </Box>

      <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Referidas
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            {fNumber(chartData.totalReferred)}h
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Asignadas
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
            {fNumber(chartData.totalAssigned)}h
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
} 