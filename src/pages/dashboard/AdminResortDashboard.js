import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Box,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
import { PATH_DASHBOARD } from '../../routes/paths';
import { formatAdminBookingResortLabel } from '../../utils/adminBookingResortOptions';
import ResortDashboardKPICards from '../../sections/@dashboard/admin/resort-dashboard/ResortDashboardKPICards';
import ResortClientsByMonthChart from '../../sections/@dashboard/admin/resort-dashboard/ResortClientsByMonthChart';
import { getResortAdminStats } from '../../redux/slices/admin';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

export default function AdminResortDashboard() {
  const { themeStretch } = useSettings();
  const { isResortAdmin, user } = useAuth();
  const dispatch = useDispatch();
  const { resortStats, isLoadingResortStats, error } = useSelector((state) => state.admin);
  const [year, setYear] = useState(CURRENT_YEAR);

  const managedResort = user?.managedResort;
  const resortLabel = formatAdminBookingResortLabel(managedResort);

  useEffect(() => {
    if (isResortAdmin && managedResort) {
      dispatch(getResortAdminStats(year));
    }
  }, [dispatch, isResortAdmin, managedResort, year]);

  const kpis = {
    totalBookings: resortStats?.totalBookings ?? 0,
    totalInquiries: resortStats?.totalInquiries ?? 0,
    totalTeachers: resortStats?.totalTeachers ?? 0,
  };

  return (
    <Page title="Dashboard del centro">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Dashboard del centro"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.root },
            { name: 'Dashboard del centro' },
          ]}
        />

        {!managedResort && (
          <Alert severity="error" sx={{ mb: 3 }}>
            No hay un centro asignado a tu cuenta de administrador.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {typeof error === 'string' ? error : 'No se pudieron cargar las estadísticas.'}
          </Alert>
        )}

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Centro administrado
            </Typography>
            <Typography variant="h6">{resortLabel}</Typography>
          </Box>

          <TextField
            select
            label="Año"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            sx={{ minWidth: 120 }}
            size="small"
          >
            {YEAR_OPTIONS.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Stack spacing={3}>
          <ResortDashboardKPICards kpis={kpis} loading={isLoadingResortStats} />
          <ResortClientsByMonthChart
            data={resortStats?.clientsByMonth ?? []}
            loading={isLoadingResortStats}
          />
        </Stack>
      </Container>
    </Page>
  );
}
