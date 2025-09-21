import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import useLocales from 'src/hooks/useLocales';
import ShopTeacherCard from '../@dashboard/e-commerce/shop/ShopTeacherCard';
import { resortTransformation } from 'src/utils/resortTransformation';

// ----------------------------------------------------------------------

const TopTeachersSection = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    marginTop: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        width: '90%',
    },
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    overflowX: 'auto',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
    scrollbarWidth: 'none',  // Firefox
    msOverflowStyle: 'none', // IE and Edge
    '&::-webkit-scrollbar': {
        display: 'none',  // Chrome, Safari and Opera
    },
}));

const TeacherCard = styled(Box)(({ theme }) => ({
    flex: '0 0 auto',
    width: '280px',
    [theme.breakpoints.down('sm')]: {
        width: '240px',
    },
}));

// ----------------------------------------------------------------------

export default function RecommendedTeachers({ teachers, disciplineSlug, type, resort }) {
    const { translate } = useLocales();

    return (
        <TopTeachersSection>
            <Box sx={{ mb: 4 }}>
                <Typography variant='h3' sx={{ mb: 1 }}>
                    {translate(`landingPRO.topTeachers`, {
                        discipline: disciplineSlug ? translate(`landingPRO.${disciplineSlug}`) : translate(`landingPRO.esqui-y-snowboard`),
                        type: type ? translate(`landingPRO.${type}Plural`) : "",
                        resort: resortTransformation(resort),
                    })}
                </Typography>
                <Typography
                    variant='body1'
                    sx={{
                        mb: 3,
                        color: 'text.secondary',
                    }}
                >
                    {translate(`landingPRO.guestAgree`, {
                        discipline: disciplineSlug ? translate(`landingPRO.${disciplineSlug}`) : translate(`landingPRO.esqui-y-snowboard`),
                        type: type ? translate(`landingPRO.${type}Plural`) : "",
                        resort: resortTransformation(resort),
                    })}
                </Typography>
                <ScrollContainer>
                    {teachers.map((teacher) => (
                        <TeacherCard key={teacher.id}>
                            <ShopTeacherCard teacher={teacher} fullBlack={true} />
                        </TeacherCard>
                    ))}
                </ScrollContainer>
            </Box>
        </TopTeachersSection>
    );
} 