import { sentenceCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Tab, Card, Grid, Divider, Container, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getTeacherWithRates, addCart, onGotoStep } from '../../redux/slices/teachers';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Markdown from '../../components/Markdown';
import { SkeletonProduct } from '../../components/skeleton';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useAuth from 'src/hooks/useAuth';
// sections
import {
  TeacherDetailsCarousel,
  TeacherDetailsSummary,
  TeacherDetailsReview,
  TeacherDetailsCalendar
} from '../../sections/@dashboard/e-commerce/teacher-details';
import CartWidget from '../../sections/@dashboard/e-commerce/CartWidget';

// ----------------------------------------------------------------------

const PRODUCT_DESCRIPTION = [
  {
    title: 'Verified',
    description: 'Verified and approved teacher',
    icon: 'ic:round-verified',
  },
  {
    title: '1 Day Reply',
    description: 'This teachers reply\'s messages in the same day' ,
    icon: 'eva:clock-fill',
  },
  {
    title: 'SnowMatch Warranty',
    description: 'SnowMatch trusts this teacher',
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

export default function EcommerceTeacherDetails({isGuest = false}) {
  
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [value, setValue] = useState('1');
  const { name = '' } = useParams();
  const { product, error, checkout } = useSelector((state) => state.product);
  
  const { teacher, isLoading } = useSelector( (state) => state.teachers);
  const { user } = useAuth();
  
  
  useEffect(() => {
    dispatch(getTeacherWithRates(name));
  }, [dispatch, name]);

  const handleAddCart = (teacher) => {
    dispatch(addCart(teacher));
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  return (
    <Page title="Ecommerce: Instructor Details">
      {isGuest && (<><br /><br /><br /></>)}
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Instructor Details"
          links={[
            !isGuest? { name: 'Dashboard', href: PATH_DASHBOARD.root} : {name: 'Home', href: '/'},
            !isGuest? { name: 'Instructors', href: PATH_DASHBOARD.eCommerce.shop,} : { name: 'Match', href: PATH_GUEST.root},
            { name: teacher?.teacher?.name + ' ' + teacher?.teacher?.lastname },
          ]
        }
        />

        {/* <CartWidget /> */}

        {!isLoading && teacher?.teacher?.email === name && (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <TeacherDetailsCarousel teacher={{ images: [teacher.teacher.imageLink]}} />
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <TeacherDetailsSummary
                    teacher={teacher}
                    cart={checkout.cart}
                    onAddCart={handleAddCart}
                    onGotoStep={handleGotoStep}
                  />
                </Grid>
              </Grid>
            </Card>
          <Grid container sx={{ my: 1 }}>
            </Grid>
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
                    <Tab disableRipple value="1" label="Calendar" />

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
                <TabPanel value="1">
                  <TeacherDetailsCalendar teacher={teacher} />
                </TabPanel>
              </TabContext>
            </Card>

            <Grid container sx={{ my: 8 }}>
              {PRODUCT_DESCRIPTION.map((item) => (
                <Grid item xs={12} md={4} key={item.title}>
                  <Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
                    <IconWrapperStyle>
                      <Iconify icon={item.icon} width={36} height={36} />
                    </IconWrapperStyle>
                    <Typography variant="subtitle1" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>


          </>
        )}
        {isLoading && <SkeletonProduct />}

        {error && <Typography variant="h6">404 Product not found</Typography>}
      </Container>
    </Page>
  );
}