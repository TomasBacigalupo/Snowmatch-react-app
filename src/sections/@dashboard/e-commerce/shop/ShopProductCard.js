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

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
  onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([null, undefined])])
};

export default function ShopProductCard({ product, onClick }) {
  const { name, price, id, description, studentLevel } = product;

  const linkTo = PATH_DASHBOARD.eCommerce.editProduct(id);

  const getLevelColor = (level) => {
    switch (level) {
      case 'FIRST_TIME':
        return 'lightgreen';
      case 'BEGINNER':
        return 'green';
      case 'INTERMEDIATE':
        return 'blue';
      case 'ADVANCED':
        return 'red';
      default:
        return 'black';
      }
  }

  const getLevelLabel = (level) => {
    switch (level) {
      case 'FIRST_TIME':
        return 'First Time';
      case 'BEGINNER':
        return 'Beginner';
      case 'INTERMEDIATE':
        return 'Intermediate';
      case 'ADVANCED':
        return 'Advanced';
      case 'EXPERT':
        return 'Expert'; 
      default:
        return 'All';
      }
  }

  return (
    <Link to={onClick ? '' : linkTo} sx={{m:0.5}} color="inherit" component={RouterLink}>
      <Card sx={{ m: 0.5, minWidth: '250px', height: '100%'}} onClick={ onClick ? onClick : ()=>{}}>
        <Box sx={{ position: 'relative' }}>
          {"status" && (
            <Label
              variant="filled"
              // color={getLevelColor(studentLevel)}
              sx={{
                top: 16,
                right: 16,
                zIndex: 9,
                position: 'absolute',
                textTransform: 'uppercase',
              }}
              style={{ 
                color: 'white',
                backgroundColor: getLevelColor(studentLevel) }}
            >
              {getLevelLabel(studentLevel)}
            </Label>
          )}
          {/* <Image alt={name} src={"cover"} ratio="1/1" /> */}
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          {/* <Link to={linkTo} color="inherit" component={RouterLink}> */}
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
          <Typography variant="subtitle3" >
            {description}
          </Typography>
          {/* </Link> */}

          <Stack direction="row" alignItems="center" justifyContent="space-between">

            <Stack direction="row" spacing={0.5}>
              {/* {priceSale && (
              <Typography component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                {fCurrency(priceSale)}
              </Typography>
            )} */}

              <Typography variant="subtitle1">{fCurrency(price)}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Link>
  );
}
