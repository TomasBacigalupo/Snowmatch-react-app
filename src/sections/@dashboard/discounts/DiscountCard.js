import PropTypes from 'prop-types';
// @mui
import { Box, Button, Grid, Card, Link, Avatar, IconButton, Typography, InputAdornment, Modal, DialogActions, DialogTitle, DialogContent } from '@mui/material';
// components
import Iconify from 'src/components/Iconify';
import Label from 'src/components/Label';
import SocialButtonsDiscounts from 'src/components/SocialButtonsDiscounts';
import { useSnackbar } from 'notistack';

DiscountCard.propTypes = {
    company: PropTypes.object
};

export default function DiscountCard({ company, onClick }) {
    const { name, description, imageUrl, discount, id, igUrl, shopUrl, fbUrl } = company;
    return (
        <Card
            key={id}
            onClick={onClick}
            sx={{
                py: 5,
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <Label
                variant="filled"
                color='error'
                sx={{
                    top: 16,
                    right: 16,
                    zIndex: 9,
                    position: 'absolute',
                    textTransform: 'uppercase',
                }}
            >
                {discount}% OFF
            </Label>
            <Avatar alt={name} src={imageUrl} sx={{ width: 90, height: 90, mb: 3, color: 'white' }} />
            <Link variant="subtitle1" color="text.primary">
                {name}
            </Link>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {description}
            </Typography>

            <SocialButtonsDiscounts 
                initialColor
                links={{igUrl: igUrl, shopUrl: shopUrl, fbUrl: fbUrl }}
             />

            <IconButton sx={{ top: 8, right: 8, position: 'absolute' }}>
                <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
            </IconButton>
        </Card>
    );
}