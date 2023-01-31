import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink, Router, useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import { ColorPreview } from '../../../../components/color-utils';
import useAuth from 'src/hooks/useAuth';
import { useState } from 'react';

// ----------------------------------------------------------------------

SchoolCard.propTypes = {
  teacher: PropTypes.object,
};

export default function SchoolCard({ business }) {
  const { name, imageLink, id, stars, level, information, email, state, resorts} = business;

  const navigate = useNavigate();
  const [src, setSrc] = useState(imageLink)

  const { isAuthenticated} = useAuth()
  const linkTo =  isAuthenticated ? PATH_DASHBOARD.eCommerce.viewSchool(id) : PATH_GUEST.viewSchool(id) ;

  return (
    <Card onClick={()=>navigate(linkTo)}>
      <Box sx={{ position: 'relative' }}>
        {resorts && (
          <Label
            variant="filled"
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
              bgcolor:'#99FFFF'
            }}
          >
            {resorts[0]}
          </Label>
        )}
        <Image alt={name} src={src} ratio="1/1" onError={()=>setSrc('/assets/notFound.jpeg')}/>
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
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
