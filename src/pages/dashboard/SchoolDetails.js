import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Tab, Card, Grid, Divider, Container, Typography } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { addCart, onGotoStep } from '../../redux/slices/teachers';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { SkeletonProduct } from '../../components/skeleton';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useAuth from 'src/hooks/useAuth';
// sections
import useLocales from 'src/hooks/useLocales';
import { getBusiness, getMembersPublic, getProductsByBusinessId } from 'src/redux/slices/business';
import { SchoolDetailsCarousel, SchoolDetailsSummary } from 'src/sections/@dashboard/e-commerce/school-details';
import SchoolDetailsMembersList from 'src/sections/@dashboard/e-commerce/school-details/SchoolDetailsMembersList';

// ----------------------------------------------------------------------

const PRODUCT_DESCRIPTION = [
  {
    title: 'verified',
    description: 'verifiedDescription',
    icon: 'ic:round-verified',
  },
  {
    title: 'reply',
    description: 'replyDescription',
    icon: 'eva:clock-fill',
  },
  {
    title: 'warranty',
    description: 'warrantyDescription',
    icon: 'ic:round-verified-user',
  },
];

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  justifyContent: 'center',
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

// ----------------------------------------------------------------------

export default function EcommerceTeacherDetails({ isGuest = false }) {

  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [value, setValue] = useState('1');
  const [name, setName] = useState('1');
  const { id = '' } = useParams();
  const { product, error, checkout } = useSelector((state) => state.product);
  const { translate } = useLocales()
  const { business, teachers, isLoading } = useSelector((state) => state.business);
  const { user } = useAuth();


  useEffect(() => {
    dispatch(getBusiness(id));
    dispatch(getProductsByBusinessId(id))
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getMembersPublic(id));
  }, [dispatch, id]);

  const handleAddCart = (teacher) => {
    dispatch(addCart(teacher));
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  return (
    <Page title={translate('schoolDetails.title')}>
      {isGuest && (<><br /><br /><br /></>)}
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('schoolDetails.title')}
          links={[
            // !isGuest? { name: translate("breadcrumb.dashboard', href: PATH_DASHBOARD.root} : {name: 'Home', href: '/'},
            !isGuest ? { name: 'Match', href: PATH_DASHBOARD.eCommerce.shop } : { name: 'Match', href: PATH_GUEST.root },
            { name: business?.name },
          ]
          }
        />

        {/* <CartWidget /> */}

        {!isLoading && business != null && (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <SchoolDetailsCarousel business={{ images: [business?.imageS3] }} />
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <SchoolDetailsSummary
                    business={business}
                    cart={checkout.cart}
                    onAddCart={handleAddCart}
                    onGotoStep={handleGotoStep}
                  />
                </Grid>
              </Grid>
            </Card>
            <br></br>
            {/* <Grid container sx={{ my: 1 }}> */}
            <Typography variant='h4'>{translate("schoolDetails.lessons")}</Typography>
            <br></br>
            <SchoolDetailsMembersList teachers={teachers} loading={isLoading}></SchoolDetailsMembersList>
            {/* </Grid> */}
            <br></br>
            <br></br>
            {/* <Grid container sx={{ my: 1 }}> */}
            <Typography variant='h4'> {translate("schoolDetails.ourTeachers")}</Typography>
            <br></br>
            {teachers && teachers.length > 0 ? (
              <SchoolDetailsMembersList teachers={teachers} loading={isLoading}></SchoolDetailsMembersList>
            ) : <Typography variant='h6'> {translate("schoolDetails.noTeachers")}</Typography>}

            {/* </Grid> */}
            <br></br>
            <Card>
              <TabContext value={value}>
                <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
                  <TabList onChange={(e, value) => setValue(value)}>
                    {/* <Tab disableRipple value="1" label="Description" /> */}
                    {/* <Tab
                      disableRipple
                      value="2"
                      label={`Review (${teacher.rates.length})`}
                      sx={{ '& .MuiTab-wrapper': { whiteSpace: 'nowrap' } }}
                    /> */}
                    <Tab disableRipple value="1" label={translate('schoolDetails.calendar')} />

                  </TabList>
                </Box>

                <Divider />

                {/* <TabPanel value="1">
                  <Box sx={{ p: 3 }}>
                    <Markdown children={teacher.information} />
                  </Box>
                </TabPanel>
                <TabPanel value="2">
                  <TeacherDetailsReview teacher={teacher} />
                </TabPanel> */}
                {/* <TabPanel value="1">
                  <TeacherDetailsCalendar teacher={business} />
                </TabPanel> */}
              </TabContext>
            </Card>

            {/* <Grid container sx={{ my: 8 }}>
              {PRODUCT_DESCRIPTION.map((item) => (
                <Grid item xs={12} md={4} key={item.title}>
                  <Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
                    <IconWrapperStyle>
                      <Iconify icon={item.icon} width={36} height={36} />
                    </IconWrapperStyle>
                    <Typography variant="subtitle1" gutterBottom>
                      {translate("schoolDetails." + item.title)}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{translate('schoolDetails.'+ item.description)}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid> */}


          </>
        )}
        {isLoading && <SkeletonProduct />}

        {error && <Typography variant="h6">404 Product not found</Typography>}
      </Container>
    </Page>
  );
}