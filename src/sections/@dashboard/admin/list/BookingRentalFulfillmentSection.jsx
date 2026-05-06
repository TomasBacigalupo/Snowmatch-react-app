import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'src/utils/axios';
import { isSkiRentalLine } from 'src/utils/rentalSkiPickupCalculations';
import RentalPickUpCard from './RentalPickUpCard';

/** Parse YYYY-MM-DD as local calendar date (avoids UTC off-by-one). */
function parseBookingYmd(value) {
  if (value == null || value === '') return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const s = String(value);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const d = Number(m[3]);
    const dt = new Date(y, mo, d);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  const dt = new Date(s);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

/** e.g. 2026-05-05 + 2026-05-12 → "05 to 12 may" */
function formatRentalLineDateRange(startRaw, endRaw) {
  const start = parseBookingYmd(startRaw);
  const end = parseBookingYmd(endRaw);
  if (!start && !end) return '—';
  if (!start || !end) {
    const fallback = [startRaw, endRaw].filter(Boolean).join(' → ');
    return fallback || '—';
  }
  const day = (d) => String(d.getDate()).padStart(2, '0');
  const mon = (d) => d.toLocaleDateString('en-GB', { month: 'short' }).toLowerCase();
  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `${day(start)} to ${day(end)} ${mon(start)}`;
  }
  if (start.getFullYear() === end.getFullYear()) {
    return `${day(start)} ${mon(start)} to ${day(end)} ${mon(end)}`;
  }
  return `${day(start)} ${mon(start)} ${start.getFullYear()} to ${day(end)} ${mon(end)} ${end.getFullYear()}`;
}

BookingRentalFulfillmentSection.propTypes = {
  booking: PropTypes.object,
  open: PropTypes.bool,
  /** When true (gear admin drawer), fetch rental lines for every open booking. */
  fetchForGearAdmin: PropTypes.bool,
};

export default function BookingRentalFulfillmentSection({ booking, open, fetchForGearAdmin = false }) {
  const [rentalLines, setRentalLines] = useState([]);
  const [rentalLinesLoading, setRentalLinesLoading] = useState(false);
  const [rentalLinesError, setRentalLinesError] = useState(null);

  useEffect(() => {
    const shouldFetch =
      open &&
      booking?.id &&
      (fetchForGearAdmin || booking?.type === 'GEAR_ONLY' || booking?.includesEquipments);
    if (!shouldFetch) {
      setRentalLines([]);
      setRentalLinesError(null);
      return undefined;
    }
    let cancelled = false;
    setRentalLinesLoading(true);
    setRentalLinesError(null);
    axios
      .get(`/api/rental/admin/reservations/booking/${booking.id}`)
      .then((res) => {
        if (!cancelled) {
          setRentalLines(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setRentalLinesError(typeof err === 'string' ? err : err?.message || 'Error');
          setRentalLines([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setRentalLinesLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [open, booking?.id, booking?.type, booking?.includesEquipments, fetchForGearAdmin]);

  const showSection =
    fetchForGearAdmin ||
    booking?.type === 'GEAR_ONLY' ||
    booking?.includesEquipments ||
    booking?.rentalFulfillment ||
    rentalLines.length > 0;

  if (!showSection) {
    return null;
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Equipo / alquiler
      </Typography>
      {(booking?.rentalFulfillment || booking?.rentalDestinationDetail) && (
        <Stack spacing={1} sx={{ mb: 2 }}>
          {booking?.rentalFulfillment && (
            <Typography variant="body2" color="text.secondary">
              Entrega:{' '}
              <Typography component="span" variant="body2" color="text.primary">
                {booking.rentalFulfillment === 'SHIP_TO_HOTEL_OR_HOME'
                  ? 'Envío a hotel o domicilio'
                  : booking.rentalFulfillment === 'PICKUP_IN_SHOP'
                  ? 'Retiro en tienda'
                  : booking.rentalFulfillment}
              </Typography>
            </Typography>
          )}
          {booking?.rentalDestinationType && (
            <Typography variant="body2" color="text.secondary">
              Tipo de destino:{' '}
              <Typography component="span" variant="body2" color="text.primary">
                {booking.rentalDestinationType === 'HOTEL_OR_CABIN'
                  ? 'Hotel / cabaña'
                  : booking.rentalDestinationType === 'HOME_ADDRESS'
                  ? 'Domicilio'
                  : booking.rentalDestinationType}
              </Typography>
            </Typography>
          )}
          {booking?.rentalDestinationDetail && (
            <Typography variant="body2" color="text.secondary">
              Dirección / hotel:{' '}
              <Typography component="span" variant="body2" color="text.primary">
                {booking.rentalDestinationDetail}
              </Typography>
            </Typography>
          )}
        </Stack>
      )}
      {rentalLinesLoading && (
        <Typography variant="body2" color="text.secondary">
          Cargando líneas de alquiler…
        </Typography>
      )}
      {rentalLinesError && (
        <Alert severity="warning" sx={{ mb: 1 }}>
          {rentalLinesError}
        </Alert>
      )}
      {!rentalLinesLoading && rentalLines.length > 0 && (
        <>
          {rentalLines.some(isSkiRentalLine) && (
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              {rentalLines.filter(isSkiRentalLine).map((line) => (
                <RentalPickUpCard key={`pickup-${line.id}`} line={line} />
              ))}
            </Stack>
          )}
          <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Ítem</TableCell>
                <TableCell>Fechas</TableCell>
                <TableCell>Participante</TableCell>
                <TableCell align="right">Altura cm</TableCell>
                <TableCell align="right">Peso kg</TableCell>
                <TableCell align="right">Pie cm</TableCell>
                <TableCell>Nivel</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rentalLines.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.itemName || '—'}</TableCell>
                  <TableCell>{formatRentalLineDateRange(row.startDate, row.endDate)}</TableCell>
                  <TableCell>
                    {[row.renterFirstName, row.renterLastName].filter(Boolean).join(' ') ||
                      '— (titular)'}
                  </TableCell>
                  <TableCell align="right">{row.renterHeightCm ?? '—'}</TableCell>
                  <TableCell align="right">{row.renterWeightKg ?? '—'}</TableCell>
                  <TableCell align="right">{row.renterFootLengthCm ?? '—'}</TableCell>
                  <TableCell>{row.renterSkiLevel || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </>
      )}
      {!rentalLinesLoading && !rentalLinesError && rentalLines.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Sin líneas de alquiler registradas para esta reserva.
        </Typography>
      )}
    </Box>
  );
}
