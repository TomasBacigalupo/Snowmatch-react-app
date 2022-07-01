import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Link, Stack, Button, Tooltip, IconButton } from '@mui/material';
//
import Iconify from './Iconify';

// ----------------------------------------------------------------------

SocialsButton.propTypes = {
  initialColor: PropTypes.bool,
  links: PropTypes.objectOf(PropTypes.string),
  simple: PropTypes.bool,
  sx: PropTypes.object,
};

export default function SocialsButton({ initialColor = false, simple = true, links = {}, sx, ...other }) {
  const SOCIALS = [
    {
      name: 'FaceBook',
      icon: 'eva:facebook-fill',
      socialColor: '#1877F2',
      path: links.fbUrl ? "https://www.facebook.com/" + links.fbUrl : "https://www.facebook.com/snowmatch.fb",
    },
    {
      name: 'Instagram',
      icon: 'ant-design:instagram-filled',
      socialColor: '#E02D69',
      path: links.igUrl?"https://www.instagram.com/"+links.igUrl : "https://instagram.com/snow.match",
    },
    {
      name: 'YouTube',
      icon: 'ant-design:youtube-filled',
      socialColor: '#FF0000',
      path: links.ytUrl?"https://www.youtube.com/channel/"+links.ytUrl : undefined,
    },
    {
      name: 'Twitter',
      icon: 'eva:twitter-fill',
      socialColor: '#00AAEC',
      path: links.twUrl?"https://www.twitter.com/"+links.twUrl : undefined,
    },
  ];

  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center">
      {SOCIALS.map((social) => { console.log(social);if(social.path != null){
        const { name, icon, path, socialColor } = social;
        return simple ? (
          <Link key={name} href={path} target="_blank">
            <Tooltip title={name} placement="top">
              <IconButton
                color="inherit"
                sx={{
                  ...(initialColor && {
                    color: socialColor,
                    '&:hover': {
                      bgcolor: alpha(socialColor, 0.08),
                    },
                  }),
                  ...sx,
                }}
                {...other}
              >
                <Iconify icon={icon} sx={{ width: 20, height: 20 }} />
              </IconButton>
            </Tooltip>
          </Link>
        ) : (
          <Button
            key={name}
            href={path}
            color="inherit"
            variant="outlined"
            size="small"
            startIcon={<Iconify icon={icon} />}
            sx={{
              m: 0.5,
              flexShrink: 0,
              ...(initialColor && {
                color: socialColor,
                borderColor: socialColor,
                '&:hover': {
                  borderColor: socialColor,
                  bgcolor: alpha(socialColor, 0.08),
                },
              }),
              ...sx,
            }}
            {...other}
          >
            {name}
          </Button>
        );
      }})}
    </Stack>
  );
}
