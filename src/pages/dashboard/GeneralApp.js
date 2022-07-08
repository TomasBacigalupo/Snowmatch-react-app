// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
  UpcomingEvents
} from '../../sections/@dashboard/general/app';
import { useDispatch, useSelector } from 'src/redux/store';
import { useEffect } from 'react';
import { getEvents } from 'src/redux/slices/calendar';
import { getTotalClasses, getTotalClients, getTotalIncome } from 'src/redux/slices/teachers';


// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user, isAuthorized } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { totalIncome, totalClasses, totalClients } = useSelector(state => state.teachers)
  const { events } = useSelector(state => state.calendar)

  useEffect(() => {
    dispatch(getTotalClasses())
    dispatch(getTotalIncome())
    dispatch(getTotalClients())
    dispatch(getEvents())
  }, [])

  if (!isAuthorized) {
    return <></>
  }

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome displayName={user?.name} />
          </Grid>

          <Grid item xs={12} md={4}>
            <UpcomingEvents/>
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Classes"
              percent={2.6}
              total={totalClasses}
              chartColor={theme.palette.primary.main}
              chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Income"
              percent={-0.2}
              total={totalIncome}
              chartColor={theme.palette.chart.blue[0]}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Clients"
              percent={-0.1}
              total={totalClients}
              chartColor={theme.palette.chart.red[0]}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload />
          </Grid>


          <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}
