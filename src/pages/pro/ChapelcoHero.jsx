import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Stack } from '@mui/material';
// components
import { MotionContainer } from 'src/components/animate';


// ----------------------------------------------------------------------

const LogoWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        alignItems: 'center'
    },
}));

const LogoImage = styled('img')(({ theme }) => ({
    width: '120px',
    height: 'auto',
    [theme.breakpoints.up('md')]: {
        width: '250px',
    }
}));


const RootStyle = styled(m.div)(({ theme }) => ({
    position: 'relative',
    backgroundColor: 'white',
    top: 0,
    left: 0,
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center',

}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
    zIndex: 10,
    margin: 'auto',
    textAlign: 'center',
    position: 'relative',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15),
    margin: 'unset',
    textAlign: 'left',
}));

const HeroOverlayStyle = styled(m.img)({
    zIndex: 9,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});

const HeroImgStyle = styled(m.div)(({ theme }) => ({
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    width: '100%',
    margin: 'auto',
    position: 'absolute',
}));

// ----------------------------------------------------------------------

export default function ChapelcoHero() {
    return (
        <MotionContainer sx={{ height: '100vh' }}>
            <RootStyle>
                <Container>
                    <ContentStyle>
                        <LogoWrapper>
                            <LogoImage src={'/logo/snowmatch.png'} alt="SnowMatch" />
                            <LogoImage src={'/assets/resorts/logos/chapelco.png'} alt="Chapelco" />
                        </LogoWrapper>
                        <Typography variant="h3" align="center" paragraph>
                            Ahora podes usar SnowMatch para conseguir más clientes
                        </Typography>
                        <Typography align="center" sx={{ color: 'text.secondary', mb: 3 }}>
                            ¿Trabajás en la escuela de Chapelco? Sumate a SnowMatch y conseguí más clientes
                        </Typography>
                        <Typography align="center" sx={{ color: 'text.secondary', mb: 3 }}>
                            Deslizá hacia abajo y seguí los pasos
                        </Typography>
                    </ContentStyle>
                </Container>
            </RootStyle>
        </MotionContainer>
    );
}
