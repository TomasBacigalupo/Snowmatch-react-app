// @mui
import { styled } from '@mui/material/styles';
import { Box, Grid, Switch, Container, Typography, Stack } from '@mui/material';
// _mock_
import { _pricingPlans } from '../_mock';
// components
import Page from '../components/Page';
// sections
import { PricingPlanCard } from '../sections/pricing';
import useLocales from 'src/hooks/useLocales';
import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from '../assets';

// ----------------------------------------------------------------------

export const snowmatchPricing = [
  {
    subscription: 'basic',
    icon: <PlanFreeIcon />,
    price: 0,
    caption: 'forever',
    lists: [
      { text: '3 prototypes', isAvailable: true },
      { text: '3 boards', isAvailable: true },
      { text: 'Up to 5 team members', isAvailable: false },
      { text: 'Advanced security', isAvailable: false },
      { text: 'Permissions & workflows', isAvailable: false },
    ],
    labelAction: 'current plan',
  },
  {
    subscription: 'starter',
    icon: <PlanStarterIcon />,
    price: '15%',
    caption: 'saving $24 a year',
    lists: [
      { text: 'Match service', isAvailable: true },
      { text: 'Season Data Analytics', isAvailable: true },
      { text: 'Social Media population', isAvailable: true },
      { text: 'School Board', isAvailable: false },
      { text: 'Permissions & workflows', isAvailable: false },
    ],
    labelAction: 'choose starter',
  },
  {
    subscription: 'premium',
    icon: <PlanPremiumIcon />,
    price: '20%',
    caption: 'saving $124 a year',
    lists: [
      { text: 'Clients SnowMatch', isAvailable: true },
      { text: 'Season Data Analytics', isAvailable: true },
      { text: 'Up to 5 team members', isAvailable: true },
      { text: 'Advanced security', isAvailable: true },
      { text: 'Permissions & workflows', isAvailable: true },
    ],
    labelAction: 'choose premium',
  },
];

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100%',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function Pricing() {
  const {translate} = useLocales()
  return (
    <Page title="Pricing">
      <RootStyle>
        <Container>
          <Typography variant="h3" align="center" paragraph>
            {translate('pricing.title1')}
            <br /> {translate('pricing.title2')}
          </Typography>
          <Typography align="center" sx={{ color: 'text.secondary', mb:3 }}>
            {translate("pricing.subtitle")}
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                subscription: 'basic',
                icon: <PlanFreeIcon />,
                price: 0,
                caption: 'forever',
                lists: [
                  { text: translate('pricing.feature1'), isAvailable: true },
                  { text: translate('pricing.feature2'), isAvailable: true },
                  { text: translate('pricing.feature3'), isAvailable: false },
                  { text: translate('pricing.feature4'), isAvailable: false },
                  { text: translate('pricing.feature5'), isAvailable: false },
                  { text: translate('pricing.feature6'), isAvailable: false },
                  { text: translate('pricing.feature7'), isAvailable: false },
                ],
                labelAction: 'current plan',
              },
              {
                subscription: 'starter',
                icon: <PlanStarterIcon />,
                price: '15%',
                caption: 'Control your mountain',
                lists: [
                  { text: translate('pricing.feature1'), isAvailable: true },
                  { text: translate('pricing.feature2'), isAvailable: true },
                  { text: translate('pricing.feature3'), isAvailable: true },
                  { text: translate('pricing.feature4'), isAvailable: true },
                  { text: translate('pricing.feature5'), isAvailable: true },
                  { text: translate('pricing.feature6'), isAvailable: false },
                  { text: translate('pricing.feature7'), isAvailable: false },
                ],
                labelAction: 'choose starter',
              },
              {
                subscription: 'premium',
                icon: <PlanPremiumIcon />,
                price: '20%',
                caption: 'Control & Expand',
                lists: [
                  { text: translate('pricing.feature1'), isAvailable: true },
                  { text: translate('pricing.feature2'), isAvailable: true },
                  { text: translate('pricing.feature3'), isAvailable: true },
                  { text: translate('pricing.feature4'), isAvailable: true },
                  { text: translate('pricing.feature5'), isAvailable: true },
                  { text: translate('pricing.feature6'), isAvailable: true },
                  { text: translate('pricing.feature7'), isAvailable: true },
                ],
                labelAction: 'choose premium',
              },
            ].map((card, index) => (
              <Grid item xs={12} md={4} key={card.subscription}>
                <PricingPlanCard card={card} index={index} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </RootStyle>
    </Page>
  );
}
