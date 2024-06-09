// @mui
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { FaqsHero, FaqsCategory, FaqsList, FaqsForm } from '../sections/faqs';
import useLocales from 'src/hooks/useLocales';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Avatar } from '@mui/material';
// routes
import { m } from 'framer-motion';
import { varFade } from 'src/components/animate';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'src/routes/paths';


// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

// ----------------------------------------------------------------------

export default function Faqs() {
  const {translate} = useLocales()

  const navigate = useNavigate()
  return (
    <Page title="Faqs">
      <RootStyle>
        <FaqsHero />

        <Container sx={{ mt: 15, mb: 10, position: 'relative' }}>
          <FaqsCategory />

          <Typography variant="h3" sx={{ mb: 5 }}>
            {translate("faqs.title")}
          </Typography>

          <Grid container spacing={10}>
            <Grid item xs={12} md={6}>
              <FaqsList />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <FaqsForm />
            </Grid> */}
          </Grid>
          <Grid item xs={12} md={5.5} >
                  <Box display='flex' flexDirection='column' justifyContent='space-between'>
                    <m.div variants={varFade().inRight}>
                      <Typography variant='h3' sx={{ mb: 3 }}>Top Mountains</Typography>
                    </m.div>
                    <Box>
                      <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <m.div variants={varFade().inLeft}>
                          <Box display='flex' alignItems='center' justifyItems='center' flexDirection='column' onClick={() =>
                            navigate(PATH_DASHBOARD.eCommerce.matchIndependant)
                          }>
                            <Avatar src='assets/resorts/icon-catedral.png' sx={{
                              border: 'solid',
                              borderColor: '#003366',
                              height: '100px',
                              width: '100px'
                            }} />
                            <Typography variant='h6'>Catedral</Typography>
                          </Box>
                        </m.div>

                        <m.div variants={varFade().inUp}>
                          <Box display='flex' alignItems='center' justifyItems='center' flexDirection='column'>
                            <Avatar src='assets/resorts/icon-chapelco.png' sx={{
                              border: 'solid',
                              borderColor: '#003366',
                              height: '100px',
                              width: '100px'
                            }} />
                            <Typography variant='h6'>Chapelco</Typography>
                          </Box>
                        </m.div>
                        <m.div variants={varFade().inRight}>
                          <Box display='flex' alignItems='center' justifyItems='center' flexDirection='column'>
                            <Avatar src='assets/resorts/icon-bayo.png' sx={{
                              border: 'solid',
                              borderColor: '#003366',
                              height: '100px',
                              width: '100px'
                            }} />
                            <Typography variant='h6'>Bayo</Typography>
                          </Box>
                        </m.div>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
        </Container>
      </RootStyle>
    </Page>
  );
}
