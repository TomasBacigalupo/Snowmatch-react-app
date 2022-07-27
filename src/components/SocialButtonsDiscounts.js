import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Link, Stack, Button, Tooltip, IconButton } from '@mui/material';
//
import Iconify from './Iconify';

// ----------------------------------------------------------------------

SocialsButtonsDiscounts.propTypes = {
    initialColor: PropTypes.bool,
    links: PropTypes.objectOf(PropTypes.string),
    simple: PropTypes.bool,
    sx: PropTypes.object,
};

export default function SocialsButtonsDiscounts({ initialColor = false, simple = true, links = {}, sx, ...other }) {
    const SOCIALS = [
        {
            name: 'Shop',
            icon: 'ant-design:shopping-filled',
            socialColor: '#FFFFFF',
            path: links.shopUrl,
        },
        {
            name: 'Instagram',
            icon: 'ant-design:instagram-filled',
            socialColor: '#E02D69',
            path: links.igUrl,
        },
        {
            name: 'FaceBook',
            icon: 'eva:facebook-fill',
            socialColor: '#1877F2',
            path: links.fbUrl,
        },
    ];

    return (
        <Stack direction="row" flexWrap="wrap" alignItems="center">
            {SOCIALS.map((social) => {
                    const { name, icon, path, socialColor } = social;
                    return simple ? (
                        <Link key={name} href={path} target="_blank">
                            <Tooltip title={name} placement="top">
                                <IconButton
                                    color="inherit"
                                    sx={{
                                        zIndex: 1000,
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
                                zIndex: 1000,
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
                
            })}
        </Stack>
    );
}
