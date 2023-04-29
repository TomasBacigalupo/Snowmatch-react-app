import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {
    Box,
    Table,
    Divider,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    Typography,
    IconButton,
    TableContainer,
} from '@mui/material';
// utils
import getColorName from '../../../../utils/getColorName';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import { formatDate } from '@fullcalendar/react';
import useLocales from 'src/hooks/useLocales';
import { toLower } from 'lodash';
import { useSelector } from 'src/redux/store';
import { format } from 'date-fns/esm';

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
                        <TableCell>Date</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="right" />
                    </TableRow>
                </TableHead>

                <TableBody>
                    {events.map((event, idx) => {
                        const { price, date } = event;
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
                                                {translate('checkout.start_time')} {format(event.start, "basic")} {translate('checkout.end_time')} {format(event.end, "basic")}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>

                                <TableCell align="right">{price === 0 ? translate('checkout.deal_with_pro') : fCurrency(price)}</TableCell>

                                <TableCell align="right">
                                    <IconButton onClick={() => onDelete(idx)}>
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