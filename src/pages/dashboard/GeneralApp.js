// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Card, CardContent, Typography, Button, Stack, Box, alpha, Link } from '@mui/material';
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
import { VideoLibrary, Upload, CalendarMonth, Help, EventAvailable, Star, Share, OpenInNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


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
  const navigate = useNavigate();


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
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6}>
            <AppWidgetSummary
            title={translate('generalApp.totalRatedVideos')}
              
              total={lessonsChartData.reduce((a, b) => a + b, 0)}
              chartColor={theme.palette.chart.blue[0]}
              unit="hrs"
              videos={true}
              sx={{ height: '100px', p: 2.5 }}
            />
          </Grid>

          <Grid item xs={6}>
            <AppWidgetSummary
              title={translate('generalApp.totalBookedHours')}
              total={incomeChartData.reduce((a, b) => a + b, 0)}
              chartColor={theme.palette.chart.violet[0]}
              icon="mdi:video-check"
              sx={{ height: '100px', p: 2.5 }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {/* Rate Videos Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 2,
                position: 'relative',
                transition: 'all 0.2s',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'grey.200',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: 'grey.300',
                  bgcolor: 'grey.50'
                },
                bgcolor: 'background.paper',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: 'grey.100',
                    color: 'grey.700'
                  }}
                >
                  <VideoLibrary sx={{ width: 24, height: 24 }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 600 }}>
                    {translate('dashboard.actions.rateAndHelp.title')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    {translate('dashboard.actions.rateAndHelp.description')}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="medium"
                  color="primary"
                  sx={{
                    minWidth: '120px',
                  }}
                  onClick={() => navigate('/dashboard/videoCoach/unrated')}
                >
                  {translate('dashboard.actions.rateAndHelp.button')}
                </Button>
              </Stack>
            </Card>
          </Grid>

          {/* Upload Video Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 2,
                position: 'relative',
                transition: 'all 0.2s',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'grey.200',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: 'grey.300',
                  bgcolor: 'grey.50'
                },
                bgcolor: 'background.paper',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: 'grey.100',
                    color: 'grey.700'
                  }}
                >
                  <Upload sx={{ width: 24, height: 24 }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 600 }}>
                    {translate('dashboard.actions.uploadVideo.title')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    {translate('dashboard.actions.uploadVideo.description')}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="medium"
                  color="primary"
                  sx={{
                    minWidth: '120px',
                  }}
                >
                  {translate('dashboard.actions.uploadVideo.button')}
                </Button>
              </Stack>
            </Card>
          </Grid>

          {/* Calendar Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 2,
                position: 'relative',
                transition: 'all 0.2s',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'grey.200',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: 'grey.300',
                  bgcolor: 'grey.50'
                },
                bgcolor: 'background.paper',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: 'grey.100',
                    color: 'grey.700'
                  }}
                >
                  <CalendarMonth sx={{ width: 24, height: 24 }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 600 }}>
                    {translate('dashboard.actions.manageCalendar.title')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    {translate('dashboard.actions.manageCalendar.description')}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="medium"
                  color="primary"
                  sx={{
                    minWidth: '120px',
                  }}
                  onClick={() => navigate('/dashboard/calendar')}
                >
                  {translate('dashboard.actions.manageCalendar.button')}
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* New "Get the Most" section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {translate('dashboard.getTheMost.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            {translate('dashboard.getTheMost.subtitle')}
          </Typography>

          <Grid container spacing={2}>
            
            {/* Refer Card */}
            <Grid item xs={12} md={6} lg={3}>
              <Box
                sx={{
                  p: 2.5,
                  height: '100%',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                }}
              >
                <Stack spacing={2.5}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}>
                    <Share sx={{ width: 28, height: 28, color: 'text.primary' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {translate('dashboard.getTheMost.refer.title')}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {translate('dashboard.getTheMost.refer.description')}
                  </Typography>

                  <Button
                    variant="text"
                    size="large"
                    color="primary"
                    sx={{
                      justifyContent: 'flex-start',
                      px: 0,
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    {translate('dashboard.getTheMost.refer.button')}
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* Calendar Card */}
            <Grid item xs={12} md={6} lg={3}>
              <Box
                sx={{
                  p: 2.5,
                  height: '100%',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                }}
              >
                <Stack spacing={2.5}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}>
                    <EventAvailable sx={{ width: 28, height: 28, color: 'text.primary' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {translate('dashboard.getTheMost.calendar.title')}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {translate('dashboard.getTheMost.calendar.description')}
                  </Typography>

                  <Button
                    variant="text"
                    size="large"
                    color="primary"
                    sx={{
                      justifyContent: 'flex-start',
                      px: 0,
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    {translate('dashboard.getTheMost.calendar.button')}
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* Feedback Card */}
            <Grid item xs={12} md={6} lg={3}>
              <Box
                sx={{
                  p: 2.5,
                  height: '100%',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                }}
              >
                <Stack spacing={2.5}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}>
                    <Star sx={{ width: 28, height: 28, color: 'text.primary' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {translate('dashboard.getTheMost.feedback.title')}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {translate('dashboard.getTheMost.feedback.description')}
                  </Typography>

                  <Button
                    variant="text"
                    size="large"
                    color="primary"
                    sx={{
                      justifyContent: 'flex-start',
                      px: 0,
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    {translate('dashboard.getTheMost.feedback.button')}
                  </Button>
                </Stack>
              </Box>
            </Grid>


            {/* Support Card */}
            <Grid item xs={12} md={6} lg={3}>
              <Card
                component={Link}
                href="https://blog.snowmatch.pro/support"
                target="_blank"
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'block',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'grey.300',
                    bgcolor: 'grey.50'
                  }
                }}
              >
                <Stack spacing={2}>
                  <Box sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: 'grey.100',
                    width: 'fit-content'
                  }}>
                    <Help sx={{ width: 24, height: 24, color: 'grey.700' }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {translate('dashboard.getTheMost.support.title')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      {translate('dashboard.getTheMost.support.description')}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Typography variant="body2" color="primary">
                        {translate('dashboard.getTheMost.support.button')}
                      </Typography>
                      <OpenInNew sx={{ width: 16, height: 16 }} />
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
}
