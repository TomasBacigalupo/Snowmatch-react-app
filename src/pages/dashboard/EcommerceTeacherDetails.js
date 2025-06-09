import { sentenceCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Tab, Card, Grid, Divider, Container, Typography, Hidden, Button } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getTeacherWithRates, addCart, onGotoStep, getTeacherBiId, getFreeTeachers } from '../../redux/slices/teachers';
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
  TeacherDetailsCalendar,
  TeacherDetailsMobileCalendar,
  TeacherDetailsMobileReview,
  MobileSelectDays
} from '../../sections/@dashboard/e-commerce/teacher-details';
import CartWidget from '../../sections/@dashboard/e-commerce/CartWidget';
import useLocales from 'src/hooks/useLocales';
import Policies from '../../sections/@dashboard/e-commerce/teacher-details/Policies'
import TimeDetails from 'src/sections/@dashboard/e-commerce/teacher-details/TimeDetails';
import { Helmet } from 'react-helmet-async';
import { trackViewTeacher } from 'src/services/tagmanager';
import RecommendedTeachers from 'src/sections/home/RecommendedTeachers';
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
  const { teacher, isLoading, teachers, filters } = useSelector((state) => state.teachers);
  const { rates } = useSelector((state) => state.rates);
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    dispatch(getTeacherBiId(id));
  }, [dispatch, id]);

  useEffect(() => {
    const resort = teacher?.resorts?.lenght > 0 ? teacher?.resorts[0] : "Cerro Catedral";
    if (teacher) {
      dispatch(getFreeTeachers(filters.from, filters.to, resort, 0, 6));
    }
  }, [dispatch, teacher]);

  const handleAddCart = (teacher) => {
    dispatch(addCart(teacher));
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  useEffect(() => {
    if (teacher && (!user || !user.role === 'TEACHER')) {
      trackViewTeacher(teacher)
    }
  }, [teacher, user])

  return (
    <Page title={translate('teacherDetails.title')}>
      <Helmet>
        <title>
          {translate('teacherDetails.metatitle',
            {
              discipline: teacher?.discipline ? `${translate(`landingPRO.${teacher?.discipline[0]}`)}` : 'Ski',
              name: `${teacher?.name} ${teacher?.lastname}`,
              resort: teacher?.resorts?.lenght > 0 ? teacher.resorts[0] : 'Bariloche'
            })}
        </title>
        <meta name="description" content={teacher?.information} />
        <meta property="og:title" content={teacher?.name} />
        <meta property="og:description" content={teacher?.information} />
        <meta property="og:image" content={teacher?.imageLink} />
        <link rel="canonical" href="https://snowmatch.pro/match/teacher/${id}" />
        <meta property="og:url" content={`https://snowmatch.pro/match/teacher/${id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsActivityLocation",
            "name": `${teacher?.name} ${teacher?.lastname} - Instructor de Esquí`,
            "image": teacher?.imageLink,
            "description": teacher?.information,
            "provider": {
              "@type": "Person",
              "name": `${teacher?.name} ${teacher?.lastname}`,
              "image": teacher?.imageLink,
              "jobTitle": "Instructor de Esquí",
              "worksFor": {
                "@type": "Organization",
                "name": "SnowMatch",
                "url": "https://snowmatch.pro"
              },
              "knowsAbout": teacher?.discipline?.map(d => translate(`landingPRO.${d}`))
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": (() => {
                const resort = teacher?.resort?.[0]?.toLowerCase();
                if (resort === 'chapelco' || resort === 'las pendientes') {
                  return "San Martín de los Andes";
                } else if (resort === 'cerro castor') {
                  return "Ushuaia";
                } else if (resort === 'bayo') {
                  return "Villa La Angostura";
                } else {
                  return "San Carlos de Bariloche";
                }
              })(),
              "addressRegion": (() => {
                const resort = teacher?.resort?.[0]?.toLowerCase();
                if (resort === 'cerro castor') {
                  return "Tierra del Fuego";
                } else if (resort === 'chapelco' || resort === 'las pendientes') {
                  return "Neuquén";
                } else if (resort === 'bayo') {
                  return "Neuquén";
                } else {
                  return "Río Negro";
                }
              })(),
              "addressCountry": "AR"
            },
            "url": `https://snowmatch.pro/match/teacher/${id}`,
            "sameAs": teacher?.socialMedia || [],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": rates?.length > 0 ? Math.floor(rates?.map(r => r.stars).reduce((total, stars) => total + stars) / rates?.length) : 0,
              "reviewCount": rates?.length || 0,
              "bestRating": 5,
              "worstRating": 1
            },
            "review": rates?.map(rate => ({
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": rate.stars,
                "bestRating": 5,
                "worstRating": 1
              },
              "author": {
                "@type": "Person",
                "name": `${rate.raterName} ${rate.raterLastname}`
              },
              "datePublished": rate.rateDate,
              "reviewBody": rate.comment,
              "itemReviewed": {
                "@type": "SportsActivityLocation",
                "name": `${teacher?.name} ${teacher?.lastname} - Instructor de Esquí`,
                "url": `https://snowmatch.pro/match/teacher/${id}`,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": (() => {
                    const resort = teacher?.resort?.[0]?.toLowerCase();
                    if (resort === 'chapelco' || resort === 'las pendientes') {
                      return "San Martín de los Andes";
                    } else if (resort === 'cerro castor') {
                      return "Ushuaia";
                    } else if (resort === 'bayo') {
                      return "Villa La Angostura";
                    } else {
                      return "San Carlos de Bariloche";
                    }
                  })(),
                  "addressRegion": (() => {
                    const resort = teacher?.resort?.[0]?.toLowerCase();
                    if (resort === 'cerro castor') {
                      return "Tierra del Fuego";
                    } else if (resort === 'chapelco' || resort === 'las pendientes') {
                      return "Neuquén";
                    } else if (resort === 'bayo') {
                      return "Neuquén";
                    } else {
                      return "Río Negro";
                    }
                  })(),
                  "addressCountry": "AR"
                }
              }
            })) || [],
            "mainEntity": {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": translate("144.faqs.0.question"),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": translate("144.faqs.0.answer")
                  }
                },
                {
                  "@type": "Question",
                  "name": translate("144.faqs.1.question"),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": translate("144.faqs.1.answer")
                  }
                },
                {
                  "@type": "Question",
                  "name": translate("144.faqs.2.question"),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": translate("144.faqs.2.answer")
                  }
                },
                {
                  "@type": "Question",
                  "name": translate("144.faqs.3.question"),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": translate("144.faqs.3.answer")
                  }
                },
                {
                  "@type": "Question",
                  "name": translate("144.faqs.4.question"),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": translate("144.faqs.4.answer")
                  }
                },
                {
                  "@type": "Question",
                  "name": translate("144.faqs.5.question"),
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": translate("144.faqs.5.answer")
                  }
                }
              ]
            }
          })}
        </script> 
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'} p={0} sx={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 60px)' }}>
        <HeaderBreadcrumbs
          heading={translate('teacherDetails.h1',
            {
              discipline: teacher?.discipline ? `${translate(`landingPRO.${teacher?.discipline[0]}`)}` : 'Ski',
              name: `${teacher?.name} ${teacher?.lastname}`,
              resort: teacher?.resort?.lenght > 0 ? teacher.resort[0] : 'Bariloche'
            })}
          links={[
            // !isGuest? { name: translate("breadcrumb.dashboard', href: PATH_DASHBOARD.root} : {name: 'Home', href: '/'},
            !isGuest ? { name: 'Match', href: PATH_DASHBOARD.eCommerce.shop, } : { name: 'Match', href: PATH_GUEST.independent },
            { name: teacher?.name + ' ' + teacher?.lastname },
          ]
          }
        />
        {!isLoading && teacher && (
          <>
            <Hidden smUp>
              <TeacherDetailsCarousel teacher={{ images: [teacher?.imageLink], name: teacher?.name }} />
            </Hidden>
            <Grid container spacing={3} p={0}>
              <Hidden smDown>
                <Grid item xs={12} md={6} lg={7}>
                  <TeacherDetailsCarousel teacher={{ images: [teacher?.imageLink], name: teacher?.name }} />

                  <TeacherDetailsMobileReview teacher={teacher} />
                  <Box mb={3}>
                    <Typography component="h2" variant="h5" gutterBottom>
                      {translate('teacherDetails.ocupation.title')}
                    </Typography>
                    <Typography component="p" variant="body1" paragraph>
                      {translate('teacherDetails.ocupation.description')}
                    </Typography>
                    <Box onClick={() => setIsOpen(true)}>
                      <TeacherDetailsMobileCalendar teacher={teacher} />
                    </Box>
                  </Box>
                  <Box mb={3}>
                    <Divider />
                  </Box>
                  <Policies />
                  <Box mb={3}>
                    <Divider />
                  </Box>
                  <TimeDetails />

                </Grid>
              </Hidden>
              <Grid item xs={12} md={6} lg={5}>
                <Box sx={{ position: 'sticky', top: 44 }}>
                  <Hidden smDown>
                    <Box mb={3} sx={{}}>
                      <Typography component='h1' variant='h4' gutterBottom>{teacher.name}</Typography>
                      <Typography component='p' variant='body1' color="text.secondary" paragraph>
                        {teacher.information}
                      </Typography>
                      <Typography component='p' variant='body1' paragraph>
                        {teacher.description}
                      </Typography>
                      <MobileSelectDays teacher={teacher} isOpen={isOpen} closeFather={() => setIsOpen(false)} />
                    </Box>
                  </Hidden>
                  <Hidden smUp>
                    <Hidden smUp>
                      <TeacherDetailsSummary
                        teacher={teacher}
                        cart={checkout.cart}
                        onAddCart={handleAddCart}
                        onGotoStep={handleGotoStep}
                      />
                    </Hidden>
                    <Box mb={3}>
                      <Divider />
                    </Box>
                    <Hidden smUp>
                      <Grid container>
                        {PRODUCT_DESCRIPTION.map((item) => (
                          <Grid item xs={12} md={4} key={item.title} width={'100%'}>
                            <Box display='flex' alignItems='flex-start' sx={{ my: 2, ml: 2, width: '100%', textAlign: 'start' }}>
                              <Box><IconWrapperMobileStyle>
                                <Iconify icon={item.icon} width={16} height={16} />
                              </IconWrapperMobileStyle></Box>
                              <Box ml={2}>
                                <Typography component="p" variant="subtitle1" gutterBottom>
                                  {translate("teacherDetails." + item.title)}
                                </Typography>
                                <Typography component="p" sx={{ color: 'text.secondary' }}>
                                  {translate('teacherDetails.' + item.description)}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Hidden>
                    <Box mb={3}>
                      <Divider />
                    </Box>
                    <Box mb={3}>
                      <Typography component="h2" variant="h5" gutterBottom>
                        {translate('teacherDetails.ocupation.title')}
                      </Typography>
                      <Typography component="p" variant="body1" paragraph>
                        {translate('teacherDetails.ocupation.description')}
                      </Typography>
                      <Box onClick={() => setIsOpen(true)}>
                        <TeacherDetailsMobileCalendar teacher={teacher} />
                      </Box>
                    </Box>
                    <Box mb={3}>
                      <Divider />
                    </Box>
                    <TeacherDetailsMobileReview teacher={teacher} />
                    <Box mb={3}>
                      <Divider />
                    </Box>
                    <Policies />
                    <Box mb={3}>
                      <Divider />
                    </Box>
                    <TimeDetails />
                    <Box mb={3}>
                      <RecommendedTeachers
                        teachers={[]}
                        resort={teacher?.resorts?.lenght > 0 ? teacher.resorts[0] : 'Cerro Catedral'}
                        disciplineSlug={teacher?.discipline?.lenght > 0 ? teacher.discipline[0] : "esqui-y-snowboard"}
                      />
                    </Box>
                    <MobileSelectDays teacher={teacher} isOpen={isOpen} closeFather={() => setIsOpen(false)} />
                  </Hidden>
                </Box>
              </Grid>
            </Grid>
            <Hidden smDown>
              <Box mb={3} ml={-4.5}>
                <RecommendedTeachers
                  teachers={teachers}
                  resort={teacher?.resorts?.lenght > 0 ? teacher.resorts[0] : 'Cerro Catedral'}
                  disciplineSlug={teacher?.discipline?.lenght > 0 ? teacher.discipline[0] : "esqui-y-snowboard"}
                />
              </Box>
            </Hidden>
          </>
        )}
        {isLoading && <SkeletonProduct />}
      </Container>
    </Page>
  );
}