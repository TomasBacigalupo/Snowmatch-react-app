import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {
    Box,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    Typography,
    IconButton,
    TableContainer,
} from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import { formatDate } from '@fullcalendar/react';
import useLocales from 'src/hooks/useLocales';
import { useSelector } from 'src/redux/store';

// ----------------------------------------------------------------------

const IncrementerStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(0.5, 0.75),
    borderRadius: theme.shape.borderRadius,
    border: `solid 1px ${theme.palette.grey[500_32]}`,
}));

// ----------------------------------------------------------------------

CheckoutTeacherList.propTypes = {
    events: PropTypes.array.isRequired,
    onDelete: PropTypes.func,
    onDecreaseQuantity: PropTypes.func,
    onIncreaseQuantity: PropTypes.func,
};

export default function CheckoutTeacherList({ events, onDelete, onIncreaseQuantity, onDecreaseQuantity }) {
    const {translate} = useLocales()
    const {teacher} = useSelector(state => state.teachers)
    return (
        <TableContainer >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{translate('checkout.date')}</TableCell>
                        <TableCell align="center">{translate('checkout.date')}</TableCell>
                        <TableCell align="right" />
                    </TableRow>
                </TableHead>

                <TableBody>
                    {events.map((event, idx) => {
                        const { price, id } = event;
                        return (
                            <TableRow key={idx}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Image alt="teacher Picture" src={teacher.imageLink} sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }} />
                                        <Box>
                                            <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                                                {formatDate(event.start)}
                                            </Typography>
                                            {/* start and end time od the event */}
                                            <Typography noWrap variant="body2" sx={{ color: 'text.secondary' }}>
                                                {`${event.start.getHours()}:${event.start.getMinutes() < 10 ? '0' + event.start.getMinutes() : event.start.getMinutes()}`} {translate('checkout.end_time')}  {`${event.end.getHours()}:${event.end.getMinutes() < 10 ? '0' + event.end.getMinutes() : event.end.getMinutes() }`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>

                                <TableCell align="right">{price === 0 ? translate('checkout.deal_with_pro') : fCurrency(price)}</TableCell>

                                <TableCell align="right">
                                    <IconButton onClick={() => onDelete(id)}>
                                        <Iconify icon={'eva:trash-2-outline'} width={20} height={20} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

// ----------------------------------------------------------------------

Incrementer.propTypes = {
    available: PropTypes.number,
    quantity: PropTypes.number,
    onIncrease: PropTypes.func,
    onDecrease: PropTypes.func,
};

function Incrementer({ available, quantity, onIncrease, onDecrease }) {
    return (
        <Box sx={{ width: 96, textAlign: 'right' }}>
            <IncrementerStyle>
                <IconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
                    <Iconify icon={'eva:minus-fill'} width={16} height={16} />
                </IconButton>
                {quantity}
                <IconButton size="small" color="inherit" onClick={onIncrease} disabled={quantity >= available}>
                    <Iconify icon={'eva:plus-fill'} width={16} height={16} />
                </IconButton>
            </IncrementerStyle>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                available: {available}
            </Typography>
        </Box>
    );
}