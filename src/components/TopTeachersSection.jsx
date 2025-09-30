import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShopTeacherCard from '../sections/@dashboard/e-commerce/shop/ShopTeacherCard';

// ----------------------------------------------------------------------

const TopTeachersContainer = styled(Box)(({ theme }) => ({
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

TopTeachersSection.propTypes = {
    teachers: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    fullBlack: PropTypes.bool,
};

export default function TopTeachersSection({ 
    teachers, 
    title, 
    subtitle, 
    fullBlack = true 
}) {
    if (!teachers || teachers.length === 0) {
        return null;
    }

    return (
        <TopTeachersContainer>
            <Box sx={{ mb: 4 }}>
                <Typography variant='h3' sx={{ mb: 1 }}>
                    {title}
                </Typography>
                <Typography
                    variant='body1'
                    sx={{
                        mb: 3,
                        color: 'text.secondary',
                    }}
                >
                    {subtitle}
                </Typography>
                <ScrollContainer>
                    {teachers.map((teacher) => (
                        <TeacherCard key={teacher.id}>
                            <ShopTeacherCard 
                                teacher={teacher} 
                                fullBlack={fullBlack} 
                            />
                        </TeacherCard>
                    ))}
                </ScrollContainer>
            </Box>
        </TopTeachersContainer>
    );
}
