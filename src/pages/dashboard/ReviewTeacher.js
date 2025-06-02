import { sentenceCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Tab, Card, Grid, Divider, Container, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getTeacherWithRates, addCart, onGotoStep, getTeacherBiId } from '../../redux/slices/teachers';
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
import useLocales from 'src/hooks/useLocales';

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

export default function ReviewTeacher() {

    const { themeStretch } = useSettings();
    const dispatch = useDispatch();
    const [value, setValue] = useState('1');
    const { id = '' } = useParams();
    const { translate } = useLocales()
    const { teacher, isLoading, checkout } = useSelector((state) => state.teachers);
    const { user } = useAuth();


    useEffect(() => {
        dispatch(getTeacherBiId(id));
    }, [dispatch, id]);

    const handleAddCart = (teacher) => {
        dispatch(addCart(teacher));
    };

    const handleGotoStep = (step) => {
        dispatch(onGotoStep(step));
    };

    return (
        <Page title={translate('teacherDetails.title')}>
           
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={translate('teacherDetails.title')}
                    links={[
                        // !isGuest? { name: translate("breadcrumb.dashboard', href: PATH_DASHBOARD.root} : {name: 'Home', href: '/'},
                        !false ? { name: 'Match', href: PATH_DASHBOARD.eCommerce.shop, } : { name: 'Match', href: PATH_GUEST.root },
                        { name: teacher?.name + ' ' + teacher?.lastname },
                    ]
                    }
                />

                {/* <CartWidget /> */}

                {!isLoading  && (
                    <>
                        <Card>
                            <Grid container>
                                <Grid item xs={12} md={6} lg={7}>
                                    <TeacherDetailsCarousel teacher={{ images: [teacher?.imageLink] }} />
                                </Grid>
                                <Grid item xs={12} md={6} lg={5}>
                                    {teacher && <TeacherDetailsSummary
                                        teacher={teacher}
                                        cart={checkout.cart}
                                        onAddCart={handleAddCart}
                                        onGotoStep={handleGotoStep}
                                    />}
                                    
                                </Grid>
                            </Grid>
                        </Card>
                        <Grid container sx={{ my: 1 }}>
                        </Grid>
                        <Card>
                            <TabContext value={value}>
                                <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
                                    <TabList onChange={(e, value) => setValue(value)}>
                                        <Tab
                                            disableRipple
                                            value="1"
                                            label={`Reviews`}
                                            sx={{ '& .MuiTab-wrapper': { whiteSpace: 'nowrap' } }}
                                        />
                                    </TabList>
                                </Box>
                                <Divider />
                                <TabPanel value="1">
                                    {teacher && <TeacherDetailsReview teacher={teacher} openForm={true} />}
                                    
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
                                        <Typography component="p" variant="subtitle1" gutterBottom>
                                            {translate("teacherDetails." + item.title)}
                                        </Typography>
                                        <Typography component="p" sx={{ color: 'text.secondary' }}>{translate('teacherDetails.' + item.description)}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>


                    </>
                )}
                {isLoading && <SkeletonProduct />}
            </Container>
        </Page>
    );
}