import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Alert, Card, Container, Snackbar, Stack } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import FinancialFiltersBar from '../../sections/@dashboard/admin/financial/FinancialFiltersBar';
import FinancialHourRatesBar from '../../sections/@dashboard/admin/financial/FinancialHourRatesBar';
import FinancialKPICards from '../../sections/@dashboard/admin/financial/FinancialKPICards';
import HoursByLevelTable from '../../sections/@dashboard/admin/financial/HoursByLevelTable';
import { getFinancialSummary } from '../../redux/slices/admin';
import {
  DEFAULT_TEACHER_HOUR_PRICES,
  formatDateParam,
  getDefaultMonthRange,
} from '../../utils/teacherHourPricePresets';

const emptySummary = {
  paidBookingsTotal: 0,
  paidBookingsCount: 0,
  completedPayoutsTotal: 0,
  completedPayoutsCount: 0,
  pendingAssignedHours: 0,
  pendingReferredHours: 0,
  hoursByLevel: [],
};

export default function AdminFinancialDashboard() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { financialSummary, isLoading } = useSelector((state) => state.admin);

  const [dateRange, setDateRange] = useState(() => getDefaultMonthRange());
  const [resort, setResort] = useState('CERRO_CATEDRAL');
  const [assignedHourPrice, setAssignedHourPrice] = useState(DEFAULT_TEACHER_HOUR_PRICES.assigned);
  const [referredHourPrice, setReferredHourPrice] = useState(DEFAULT_TEACHER_HOUR_PRICES.referred);
  const [error, setError] = useState(null);

  const summary = financialSummary || emptySummary;

  useEffect(() => {
    const [from, to] = dateRange || [];
    if (!from || !to || !resort) {
      return;
    }
    setError(null);
    dispatch(
      getFinancialSummary({
        from: formatDateParam(from),
        to: formatDateParam(to),
        resort,
      })
    ).catch((err) => {
      setError(err?.message || t('adminFinancial.loadError'));
    });
  }, [dateRange, resort, dispatch, t]);

  const pendingPayoutsTotal = useMemo(() => {
    const assignedRate = Number(assignedHourPrice) || 0;
    const referredRate = Number(referredHourPrice) || 0;
    return (
      (summary.pendingAssignedHours || 0) * assignedRate +
      (summary.pendingReferredHours || 0) * referredRate
    );
  }, [summary.pendingAssignedHours, summary.pendingReferredHours, assignedHourPrice, referredHourPrice]);

  const kpis = {
    paidBookingsTotal: summary.paidBookingsTotal || 0,
    completedPayoutsTotal: summary.completedPayoutsTotal || 0,
    pendingPayoutsTotal,
  };

  return (
    <Page title={t('adminFinancial.pageTitle')}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={t('adminFinancial.heading')}
          links={[
            { name: t('adminFinancial.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('adminFinancial.admin'), href: PATH_DASHBOARD.admin.root },
            { name: t('adminFinancial.heading') },
          ]}
        />

        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <FinancialFiltersBar
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              resort={resort}
              onResortChange={setResort}
            />
          </Card>

          <Card sx={{ p: 3 }}>
            <FinancialHourRatesBar
              assignedHourPrice={assignedHourPrice}
              referredHourPrice={referredHourPrice}
              onAssignedChange={setAssignedHourPrice}
              onReferredChange={setReferredHourPrice}
            />
          </Card>

          <FinancialKPICards kpis={kpis} loading={isLoading} />

          <HoursByLevelTable rows={summary.hoursByLevel} loading={isLoading} />
        </Stack>

        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}
