import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Link, Stack, Button, Tooltip, IconButton } from '@mui/material';
//
import Iconify from './Iconify';
import { useTheme } from '@mui/system';

// ----------------------------------------------------------------------

ContactButton.propTypes = {
    initialColor: PropTypes.bool,
    links: PropTypes.objectOf(PropTypes.string),
    simple: PropTypes.bool,
    sx: PropTypes.object,
};

export default function ContactButton({ initialColor = false, simple = true, links = {}, sx, ...other }) {
    const theme = useTheme()
    const SOCIALS = [
        {
            name: 'Phone',
            icon: 'eva:phone-fill',
            socialColor: theme.palette.primary.main,
            path: links.phone ? "tell:" + links.phone : "https://www.facebook.com/snowmatch.fb",
        },
        {
            name: 'Mail',
            icon: 'eva:email-fill',
            socialColor: theme.palette.primary.dark,
            path: links.mail ? "mailto:" + links.mail : "https://www.facebook.com/snowmatch.fb",
        },
        {
            name: 'WhatsApp',
            icon: 'logos:whatsapp-icon',
            socialColor: '#1877F2',
            path: links.whatsapp ? "https://wa.me/" + links.whatsapp : "https://www.facebook.com/snowmatch.fb",
        },
    ];

    return (
        <Stack direction="row" flexWrap="wrap" alignItems="center">
            {SOCIALS.map((social) => {
                if (social.path != null) {
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
                                    <Iconify icon={icon} sx={{ width: 35, height: 35 }} />
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
                }
            })}
        </Stack>
    );
}