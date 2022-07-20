import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, Card, Avatar, CardHeader, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// _mock_
import { _appAuthors } from '../../../../_mock';
// components
import Iconify from '../../../../components/Iconify';
import { useDispatch } from 'src/redux/store';
import { useEffect } from 'react';
import { getTopClients } from 'src/redux/slices/teachers';
import { useSelector } from 'react-redux';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import useLocales from 'src/hooks/useLocales';
// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
}));

// ----------------------------------------------------------------------

export default function AppTopAuthors() {
  const displayAuthor = orderBy(_appAuthors, ['favourite'], ['desc']);
  const dispatch = useDispatch()
  const {translate} = useLocales()
  const {topClients} = useSelector(state => state.teachers)
  useEffect(()=>dispatch(getTopClients()),[])

  const sample = [
    {
      "cellphone": "1234567891",
      "email": "lpagni+client+7@itba.edu.ar",
      "id": 4,
      "lastname": "Pagni",
      "level": "BEGINNER",
      "name": "Lucio",
      "renting": false,
      "tip": 500.0,
      "tipper": false
    },
    {
      "cellphone": "1234567891",
      "email": "lpagni+client+10@itba.edu.ar",
      "id": 7,
      "lastname": "Pagni",
      "level": "BEGINNER",
      "name": "Lucio",
      "renting": false,
      "tip": 400.0,
      "tipper": false
    },
    {
      "cellphone": "1234567891",
      "email": "lpagni+client+9@itba.edu.ar",
      "id": 6,
      "lastname": "Pagni",
      "level": "BEGINNER",
      "name": "Lucio",
      "renting": false,
      "tip": 300.0,
      "tipper": false
    }
  ];

  return (
    <Card>
      <CardHeader title={translate("generalApp.topClients")} />
      <Stack spacing={3} sx={{ p: 3 }}>
        {topClients.map((client, index) => (
          <AuthorItem key={client.id} author={client} index={index} />
        ))}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

AuthorItem.propTypes = {
  author: PropTypes.shape({
    avatar: PropTypes.string,
    favourite: PropTypes.number,
    name: PropTypes.string,
  }),
  index: PropTypes.number,
};

function AuthorItem({ author, index }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar alt={author.name} src={author.avatar} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{author.name + ' ' +author.lastname}</Typography>
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
          }}
        >
          <AttachMoneyIcon/>
          {author.tip}
        </Typography>
      </Box>

      <IconWrapperStyle
        sx={{
          ...(index === 1 && {
            color: 'info.main',
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
          }),
          ...(index === 2 && {
            color: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }),
        }}
      >
        <Iconify icon={'ant-design:trophy-filled'} width={20} height={20} />
      </IconWrapperStyle>
    </Stack>
  );
}
