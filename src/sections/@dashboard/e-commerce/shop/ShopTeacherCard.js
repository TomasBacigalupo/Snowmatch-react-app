import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import { ColorPreview } from '../../../../components/color-utils';

// ----------------------------------------------------------------------

ShopTeacherCard.propTypes = {
  teacher: PropTypes.object,
};

export default function ShopTeacherCard({ teacher }) {
  const { name, lastname, imageLink, stars, level, information, email, state} = teacher;
  const status = 'sale';
  const priceSale = 10;

  const linkTo = PATH_DASHBOARD.eCommerce.viewTeacher(paramCase(email));

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        {status && (
          <Label
            variant="filled"
            color={(state !== 'AVAILABLE' && 'error') || 'success'}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {state === "AVAILABLE" ? "Disponible" : "Solicitado"}
          </Label>
        )}
        <Image alt={name} src={imageLink} ratio="1/1" />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name + " " + lastname}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={colors} /> */}
            <Typography component="span" sx={{ color: 'text.disabled', }}>
                {information}
            </Typography>

        
        </Stack>
      </Stack>
    </Card>
  );
}
