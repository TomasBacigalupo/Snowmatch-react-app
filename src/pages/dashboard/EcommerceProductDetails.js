import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Tab, Card, Grid, Divider, Container, Typography, Hidden, Button } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { addCart, onGotoStep, getProduct } from '../../redux/slices/teachers';
// routes
import { PATH_GUEST } from '../../routes/paths';
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
  TeacherDetailsCalendar,
  TeacherDetailsMobileCalendar,
  TeacherDetailsMobileReview,
  MobileSelectDays
} from '../../sections/@dashboard/e-commerce/teacher-details';
import CartWidget from '../../sections/@dashboard/e-commerce/CartWidget';
import useLocales from 'src/hooks/useLocales';
import { trackViewTeacher } from 'src/services/facebook';
import Policies from '../../sections/@dashboard/e-commerce/teacher-details/Policies'
import TimeDetails from 'src/sections/@dashboard/e-commerce/teacher-details/TimeDetails';
import { useTranslation } from 'react-i18next';
import FaqsDetails from 'src/sections/@dashboard/e-commerce/teacher-details/FaqsDetails';
import { Description } from '@mui/icons-material';
import DescriptionDetails from 'src/sections/@dashboard/e-commerce/teacher-details/DescriptionDetails';
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

const IconWrapperMobileStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(4),
  justifyContent: 'center',
  alignItems: 'center',
  height: theme.spacing(4),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

// ----------------------------------------------------------------------

export default function EcommerceTeacherDetails({ isGuest = false }) {

  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [value, setValue] = useState('0');
  const { id = '' } = useParams();
  const { checkout } = useSelector((state) => state.product);
  const { translate } = useLocales()
  const { isLoading, product } = useSelector((state) => state.teachers);
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };


  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  const handleAddCart = (product) => {
    dispatch(addCart(product));
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  useEffect(() => {
    if (product && (!user || !user.role === 'TEACHER')) {
      trackViewTeacher(product)
    }
  }, [product, user])

  useEffect(() => {
    console.log('product', product)
  }, [product]);


  return (
    <Page title={translate('products.experienceTitle')} meta={
      <meta name="og:description" content={translate(`product.${id}.metaDescription`)} />
    }>
      <Container maxWidth={themeStretch ? false : 'lg'} p={0}>
        <HeaderBreadcrumbs
          heading={translate('products.experienceTitle')}
          links={[
            // !isGuest? { name: translate("breadcrumb.dashboard', href: PATH_DASHBOARD.root} : {name: 'Home', href: '/'},
            !isGuest ? { name: translate('products.experiences'), href: PATH_GUEST.independent, } : { name: 'Match', href: PATH_GUEST.independent },
            { name: product?.name },
          ]
          }
        />
        <CartWidget />
        {!isLoading && product && (
          <>
            <Grid container>
              <Grid item xs={12} md={6} lg={7}>
                <TeacherDetailsCarousel teacher={{ images: [product?.imageLink] }} />
              </Grid>
              <Grid item xs={12} md={6} lg={5} container spacing={1} >
                <TeacherDetailsSummary
                  teacher={{
                    ...product,
                    description: t(`product.${product.id}.description`),
                  }}
                  cart={checkout.cart}
                  onAddCart={handleAddCart}
                  onGotoStep={handleGotoStep}
                  isProduct={true}
                />
                <Hidden smUp>

                  <DescriptionDetails id={product.id} />
                  <Box mx={2} >
                    <Divider />
                  </Box>
                  <Box mx={2} width='100%' >
                    <Divider />
                  </Box>
                  <Box mt={3}>
                    <Box px={2} pt={2}>
                      <Typography variant="h4" gutterBottom>
                        {translate('product.ocupationTitle')}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {translate('product.ocupationDescription')}
                      </Typography>
                    </Box>
                    <Box onClick={() => setIsOpen(true)}>
                      <TeacherDetailsMobileCalendar isProduct={true} teacher={product} />
                    </Box>
                  </Box>
                  <Box mx={2} width='100%'>
                    <Divider />
                  </Box>
                  {/* <TeacherDetailsMobileReview teacher={product} /> */}
                  <Box mx={2} width='100%' >
                    <Divider />
                  </Box>
                  <Policies />
                  <Box mx={2} width='100%'>
                    <Divider />
                  </Box>
                  <TimeDetails />
                  <Box mx={2} width='100%' >
                    <Divider />
                  </Box>
                  <FaqsDetails id={product.id} />
                  <MobileSelectDays product={product} teacher={product} isOpen={isOpen} closeFather={() => setIsOpen(false)} isRange={false} />
                </Hidden>
              </Grid>
            </Grid>
            <Grid container sx={{ my: 1 }}>
            </Grid>
            <Hidden smDown>
              <Card>
                <TabContext value={value}>
                  <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
                    <TabList onChange={(e, value) => setValue(value)}>
                      <Tab
                        focusRipple={true}
                        value="0"
                        icon={<Iconify icon={'material-symbols:rate-review'} width={20} height={20} />}
                        sx={{ '& .MuiTab-wrapper': { whiteSpace: 'nowrap' } }}
                      />
                      <Tab value="1" icon={<Iconify icon={'material-symbols:calendar-month'} width={20} height={20} />} sx={{ maxWidth: 'fit-content' }} />
                      <Tab value="2" icon={<Iconify icon={'mingcute:profile-line'} width={20} height={20} />} sx={{ maxWidth: 'fit-content' }} />
                    </TabList>
                  </Box>

                  <Divider />

                  <TabPanel value="0">
                    <TeacherDetailsReview teacher={product} />
                  </TabPanel>
                  <TabPanel value="1">
                    <TeacherDetailsCalendar teacher={product} />
                  </TabPanel>
                  <TabPanel value="2">
                    <Box sx={{ p: 3 }}>
                      <Markdown children={product.description} />
                    </Box>
                    <Box sx={{ p: 3 }}>
                      <Markdown children={product.description} />
                    </Box>
                  </TabPanel>
                  {/* <TabPanel value="2">
                  <Box sx={{ p: 3 }}>
                    <Typography variant='body1'>{teacher.information}</Typography>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <Typography variant='body1'>{teacher.description}</Typography>
                  </Box>
                </TabPanel> */}
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
                        {translate("teacherDetails." + item.title)}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{translate('teacherDetails.' + item.description)}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Hidden>
          </>
        )}
        {isLoading && <SkeletonProduct />}
      </Container>
    </Page>
  );
}