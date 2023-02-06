import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Avatar, Divider, Typography, Stack } from '@mui/material';
// utils
import cssStyles from '../../../../utils/cssStyles';
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';
import SocialsButton from '../../../../components/SocialsButton';
import SvgIconStyle from '../../../../components/SvgIconStyle';
import ContactButton from 'src/components/ContactButtons';
import { useDispatch, useSelector } from 'src/redux/store';
import { useEffect } from 'react';
import { getRates } from 'src/redux/slices/teachers';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
    ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.light }),
    top: 0,
    zIndex: 8,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
}));

// ----------------------------------------------------------------------

ContactCard.propTypes = {
    user: PropTypes.object.isRequired,
};

export default function ContactCard({ user }) {
    const {isTeacher} = useAuth()
    const dispatch = useDispatch()
    const {rates} = useSelector(state => state.teachers)
    const { name, follower, lastname, avatarUrl, following, phone, email, countryCode, cellphone, imageLink, events } = user;
    useEffect(()=>{
        getRates(user.id)
    }, [dispatch])
    return (
        <Card sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative' }}>
                <SvgIconStyle
                    src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
                    sx={{
                        width: 144,
                        height: 62,
                        zIndex: 10,
                        left: 0,
                        right: 0,
                        bottom: -26,
                        mx: 'auto',
                        position: 'absolute',
                        color: 'background.paper',
                    }}
                />
                <Avatar
                    alt={name}
                    src={imageLink}
                    sx={{
                        width: 64,
                        height: 64,
                        zIndex: 11,
                        left: 0,
                        right: 0,
                        bottom: -32,
                        mx: 'auto',
                        position: 'absolute',
                    }}
                />
                <OverlayStyle />
                <Box sx={{height:'40px'}} />
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 6 }}>
                {`${name} ${lastname}`}
            </Typography>
            {isTeacher && <Stack alignItems="center">
                <ContactButton
                    initialColor sx={{ my: 2.5 }}
                    links={{
                        phone: '+' + countryCode + cellphone,
                        mail: email,
                        whatsapp: '+' + countryCode + cellphone
                    }}
                />
            </Stack>}
            

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ py: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div>
                    <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
                        Hires
                    </Typography>
                    <Typography variant="subtitle1">{fShortenNumber(events.length)}</Typography>
                </div>

                <div>
                    <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
                        Reviews
                    </Typography>
                    <Typography variant="subtitle1">{rates ? rates.length : 0}</Typography>
                </div>

                <div>
                    <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
                        Level
                    </Typography>
                    <Typography variant="subtitle1">{user?.level ? user.level :'Beginner'}</Typography>
                </div>
            </Box>
        </Card>
    );
}