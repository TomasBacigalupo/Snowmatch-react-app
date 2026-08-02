import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Alert, Card, Container, Snackbar, Stack } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import FinancialFiltersBar from '../../sections/@dashboard/admin/financial/FinancialFiltersBar';
import TeacherLevelHourRatesBar from '../../sections/@dashboard/admin/financial/TeacherLevelHourRatesBar';
import FinancialKPICards from '../../sections/@dashboard/admin/financial/FinancialKPICards';
import HoursByLevelTable from '../../sections/@dashboard/admin/financial/HoursByLevelTable';
import AgencyDebtTable from '../../sections/@dashboard/admin/financial/AgencyDebtTable';
import MissingSuggestedAlert from '../../sections/@dashboard/admin/financial/MissingSuggestedAlert';
import { getFinancialSummary } from '../../redux/slices/admin';
import { calcPendingMemberPayoutFromHoursByLevel } from '../../utils/teacherPayoutAmount';
import {
  buildDefaultLevelHourPrices,
  formatDateParam,
  getDefaultMonthRange,
} from '../../utils/teacherHourPricePresets';

const SCHOOL_BUSINESS_ID = 13;

const emptySummary = {
  paidBookingsTotal: 0,
  paidBookingsCount: 0,
  unpaidBookingsTotal: 0,
  unpaidBookingsCount: 0,
  completedPayoutsTotal: 0,
  completedPayoutsCount: 0,
  pendingNonMemberSuggestedTotal: 0,
  pendingNonMemberSuggestedCount: 0,
  pendingMemberBookingCount: 0,
  missingSuggestedCount: 0,
  missingSuggestedBookings: [],
  pendingMemberHoursByLevel: [],
  hoursByLevel: [],
  agencyDebts: [],
};

export default function AdminFinancialDashboard() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { financialSummary, isLoading } = useSelector((state) => state.admin);

  const [dateRange, setDateRange] = useState(() => getDefaultMonthRange());
  const [resort, setResort] = useState('CERRO_CATEDRAL');
  const [levelPrices, setLevelPrices] = useState(() => buildDefaultLevelHourPrices());
  const [error, setError] = useState(null);

  const summary = financialSummary || emptySummary;

  useEffect(() => {
    const [from, to] = dateRange || [];
    if (!from || !to) {
      return;
    }
    setError(null);
    dispatch(
      getFinancialSummary({
        from: formatDateParam(from),
        to: formatDateParam(to),
        resort,
        businessId: SCHOOL_BUSINESS_ID,
      })
    ).catch((err) => {
      setError(err?.message || t('adminFinancial.loadError'));
    });
  }, [dateRange, resort, dispatch, t]);

  const handleLevelPriceChange = (levelKey, field, value) => {
    setLevelPrices((prev) => ({
      ...prev,
      [levelKey]: {
        ...prev[levelKey],
        [field]: value,
      },
    }));
  };

  const pendingMemberPayoutTotal = useMemo(
    () =>
      calcPendingMemberPayoutFromHoursByLevel(
        summary.pendingMemberHoursByLevel,
        levelPrices
      ),
    [summary.pendingMemberHoursByLevel, levelPrices]
  );

  const pendingPayoutsTotal = useMemo(
    () => pendingMemberPayoutTotal + (summary.pendingNonMemberSuggestedTotal || 0),
    [pendingMemberPayoutTotal, summary.pendingNonMemberSuggestedTotal]
  );

  const pendingPayoutsCount = useMemo(
    () =>
      (summary.pendingMemberBookingCount || 0) +
      (summary.pendingNonMemberSuggestedCount || 0) +
      (summary.missingSuggestedCount || 0),
    [
      summary.pendingMemberBookingCount,
      summary.pendingNonMemberSuggestedCount,
      summary.missingSuggestedCount,
    ]
  );

  const kpis = {
    paidBookingsTotal: summary.paidBookingsTotal || 0,
    paidBookingsCount: summary.paidBookingsCount || 0,
    unpaidBookingsTotal: summary.unpaidBookingsTotal || 0,
    unpaidBookingsCount: summary.unpaidBookingsCount || 0,
    completedPayoutsTotal: summary.completedPayoutsTotal || 0,
    completedPayoutsCount: summary.completedPayoutsCount || 0,
    pendingPayoutsTotal,
    pendingPayoutsCount,
  };

  const filterQuery = useMemo(() => {
    const [from, to] = dateRange || [];
    const params = new URLSearchParams();
    if (from) params.set('from', formatDateParam(from));
    if (to) params.set('to', formatDateParam(to));
    if (resort) params.set('resort', resort);
    return params.toString();
  }, [dateRange, resort]);

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
            <TeacherLevelHourRatesBar
              levelPrices={levelPrices}
              onLevelPriceChange={handleLevelPriceChange}
            />
          </Card>

          <MissingSuggestedAlert
            count={summary.missingSuggestedCount}
            bookings={summary.missingSuggestedBookings}
          />

          <FinancialKPICards
            kpis={kpis}
            loading={isLoading}
            filterQuery={filterQuery}
            getDetailPath={(category) => PATH_DASHBOARD.admin.financialDetail(category)}
          />

          <AgencyDebtTable rows={summary.agencyDebts} loading={isLoading} />

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
