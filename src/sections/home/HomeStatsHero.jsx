import { m } from 'framer-motion';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Container, Typography } from '@mui/material';
// components
import Image from '../../components/Image';
import { MotionViewport, varFade } from '../../components/animate';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import useLocales from 'src/hooks/useLocales';
import HomeStats from './HomeStats';

// ----------------------------------------------------------------------

const CARDS = [
    {
        icon: '/icons/ic_user.svg',
        title: 'clientData',
        description:
            'clientDataDesc',
    },
    {
        icon: '/icons/ic_calendar.svg',
        title: 'calendarOrg',
        description: 'calendarOrgDesc',
    },
    {
        icon: '/icons/ic_match.svg',
        title: 'match',
        description: 'matchDesc',
    },
];

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        paddingBottom: theme.spacing(15),
    },
}));



// ----------------------------------------------------------------------

export default function HomeStatsHero() {
    const theme = useTheme();
    const { translate } = useLocales()
    const isLight = theme.palette.mode === 'light';

    return (
        <RootStyle>
            <Container component={MotionViewport}>
                <Box
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    <m.div variants={varFade().inLeft}>
                        <Typography component="div" variant="overline" sx={{ mb: 2, color: 'text.disabled' }}>
                            SnowMatch
                        </Typography>
                    </m.div>
                    <m.div variants={varFade().inRight}>
                        <Typography variant="h2" sx={{ mb: 4}}>{translate('home.stats.title')}</Typography>
                    </m.div>
                    <m.div variants={varFade().inUp}>
                        <HomeStats />
                    </m.div>
                </Box>
            </Container>
        </RootStyle>
    );
}