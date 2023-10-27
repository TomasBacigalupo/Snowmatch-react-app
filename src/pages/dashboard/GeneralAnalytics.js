// @mui
import { Grid, Container, Typography } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import {
  AnalyticsTasks,
  AnalyticsNewsUpdate,
  AnalyticsOrderTimeline,
  AnalyticsCurrentVisits,
  AnalyticsWebsiteVisits,
  AnalyticsTrafficBySite,
  AnalyticsWidgetSummary,
  AnalyticsCurrentSubject,
  AnalyticsConversionRates,
} from '../../sections/@dashboard/general/analytics';

// ----------------------------------------------------------------------

export default function GeneralAnalytics() {
  const { themeStretch } = useSettings();

  return (
    <Page title="General: Analytics">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5, textAlign: 'center' }}>
          SnowMatch Season 2023 Argentina
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title="Season Bookings" total={378} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title="Total Clients" total={400} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsWebsiteVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsCurrentVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsConversionRates />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsCurrentSubject />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsOrderTimeline />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsTrafficBySite />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsTasks />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
