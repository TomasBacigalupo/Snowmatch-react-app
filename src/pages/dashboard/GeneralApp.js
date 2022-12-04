// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { BookingTotalIncomes, BookingBookedRoom } from 'src/sections/@dashboard/general/booking';
// sections
import {
  AppTopAuthors,
  AppWidgetSummary,
  AppCurrentDownload,
  UpcomingEvents
} from '../../sections/@dashboard/general/app';
import { useDispatch, useSelector } from 'src/redux/store';
import { useEffect, useState } from 'react';
import { getEvents } from 'src/redux/slices/calendar';
import { getTotalClasses, getTotalClients, getTotalIncome, getConversations } from 'src/redux/slices/teachers';
import useLocales from 'src/hooks/useLocales';
import { date } from 'yup/lib/locale';


// ----------------------------------------------------------------------

export default function GeneralApp() {

  const { user, isAuthorized } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { totalIncome, totalClasses, totalClients, conversations, openClinicModal } = useSelector(state => state.teachers)
  const { events } = useSelector(state => state.calendar)
  const { translate } = useLocales()
  const [incomeChartData, setIncomeChartData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [incomePercent, setIncomePercent] = useState(0);
  const [lessonsChartData, setLessonsChartData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [lessonsPercent, setLessonsPercent] = useState(0);
  const [waiting, setWaiting] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [rejected, setRejected] = useState(0);


  useEffect(() => {
    dispatch(getTotalClasses())
    dispatch(getTotalIncome())
    dispatch(getTotalClients())
    dispatch(getEvents())
    dispatch(getConversations())
  }, [])

  useEffect(() => {
    let incomeChartData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let lessonsChartData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    events.forEach(event => {
      if (event?.eventType === 'CLASS') {
        date = new Date(event.end);
        incomeChartData[date.getMonth()] = incomeChartData[date.getMonth()] + event.price;
        lessonsChartData[date.getMonth()] = lessonsChartData[date.getMonth()] + 1;
      }
    });
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const incomePercentDiff = incomeChartData[currentMonth] * 100 / incomeChartData[lastMonth] - 100;
    const lessonsPercentDiff = lessonsChartData[currentMonth] * 100 / lessonsChartData[lastMonth] - 100;
    setIncomePercent(incomePercentDiff);
    setIncomeChartData(incomeChartData.filter(income => income !== 0));
    setLessonsChartData(lessonsChartData);
    setLessonsPercent(lessonsPercentDiff);

  }, [events])

  useEffect(() => {
    let _waiting = 0
    let _accepted = 0
    let _reject = 0
    conversations.forEach(conversation => {
      if (conversation.status === "WAITING") {
        _waiting = _waiting + 1
      }
      if (conversation.status === "ACCEPT") {
        _accepted = _accepted + 1
      }
      if (conversation.status === "REJECT") {
        _reject = _reject + 1
      }
    })
    setWaiting(_waiting)
    setAccepted(_accepted)
    setRejected(_reject)
  }, [conversations])



  if (!isAuthorized) {
    return <></>
  }

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>

          <Grid item xs={12} md={4}>
            <UpcomingEvents />
          </Grid>
          <Grid item xs={12} md={4}>
            <BookingTotalIncomes total={totalIncome} percent={incomePercent} chartData={[{ data: incomeChartData }]} />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingBookedRoom overview={[{ status: "Cancel", quantity: rejected, value: rejected * 100 / conversations.length }, { status: "Pending", quantity: waiting, value: waiting * 100 / conversations.length }, { status: "Accepted", quantity: accepted, value: accepted * 100 / conversations.length }]} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title={translate('generalApp.totalLessons')}
              percent={lessonsPercent}
              total={totalClasses}
              chartColor={theme.palette.primary.main}
              chartData={lessonsChartData}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title={translate('generalApp.totalIncome')}
              percent={incomePercent}
              total={totalIncome}
              chartColor={theme.palette.chart.blue[0]}
              chartData={incomeChartData}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title={translate('generalApp.totalClients')}
              percent={0.1}
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
