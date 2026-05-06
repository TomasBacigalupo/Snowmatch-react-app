import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  Checkbox,
  Button,
  Box,
  Collapse,
} from '@mui/material';
import Iconify from '../../../../components/Iconify';
import {
  calcSkiLengthRangeCm,
  calcApproxDinSetting,
  calcBootSoleLengthMm,
} from 'src/utils/rentalSkiPickupCalculations';

RentalPickUpCard.propTypes = {
  line: PropTypes.object.isRequired,
  onMarkReadyPickup: PropTypes.func,
};

export default function RentalPickUpCard({ line, onMarkReadyPickup }) {
  const [selected, setSelected] = useState(false);
  const [readyForPickup, setReadyForPickup] = useState(false);
  const [marking, setMarking] = useState(false);
  const [medidasOpen, setMedidasOpen] = useState(false);

  const h = line.renterHeightCm;
  const w = line.renterWeightKg;
  const foot = line.renterFootLengthCm;

  const skiLen = calcSkiLengthRangeCm(h);
  const din = calcApproxDinSetting(w, line.renterSkiLevel);
  const soleMm = calcBootSoleLengthMm(foot);

  const handleMarkReady = async () => {
    setMarking(true);
    try {
      if (onMarkReadyPickup) {
        await onMarkReadyPickup(line);
      }
      setReadyForPickup(true);
    } catch (e) {
      console.error(e);
    } finally {
      setMarking(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent
        sx={{
          position: 'relative',
          '&:last-child': { pb: 2 },
          cursor: readyForPickup ? 'default' : 'pointer',
        }}
        onClick={() => {
          if (!readyForPickup) {
            setSelected((s) => !s);
          }
        }}
      >
        <Box
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={selected || readyForPickup}
            disabled={readyForPickup}
            onChange={(e) => {
              if (!readyForPickup) {
                setSelected(e.target.checked);
              }
            }}
            color="primary"
            sx={{ p: 0.5 }}
            inputProps={{ 'aria-label': 'Datos revisados' }}
          />
        </Box>

        <Stack spacing={1.5}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ pr: 5, gap: 1 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, flex: 1, minWidth: 0 }}
            >
              {line.itemName || '—'}
            </Typography>
            <Button
              size="small"
              variant="text"
              color="inherit"
              onClick={(e) => {
                e.stopPropagation();
                setMedidasOpen((o) => !o);
              }}
              endIcon={
                <Iconify
                  icon={medidasOpen ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'}
                  width={20}
                  height={20}
                />
              }
              sx={{
                px: 0.5,
                py: 0.25,
                minHeight: 0,
                flexShrink: 0,
                color: 'primary.main',
                fontWeight: 600,
                textTransform: 'none',
                justifyContent: 'flex-end',
                '& .MuiButton-endIcon': { ml: 0.5 },
              }}
            >
              {medidasOpen ? 'Ocultar medidas' : 'Ver medidas'}
            </Button>
          </Stack>

          <Collapse in={medidasOpen} timeout="auto" unmountOnExit>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Participante (medidas)
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="body2">
                Altura:{' '}
                <strong>{h != null && h !== '' ? `${h} cm` : '—'}</strong>
              </Typography>
              <Typography variant="body2">
                Peso:{' '}
                <strong>{w != null && w !== '' ? `${w} kg` : '—'}</strong>
              </Typography>
              <Typography variant="body2">
                Pie:{' '}
                <strong>{foot != null && foot !== '' ? `${foot} cm` : '—'}</strong>
              </Typography>
            </Stack>
          </Collapse>

          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Calculado (referencia tienda)
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" component="div">
                  Longitud esquí: <strong>{skiLen ? skiLen.label : '—'}</strong>
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" component="div">
                  DIN (aprox.): <strong>{din != null ? din : '—'}</strong>
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" component="div">
                  Apertura fijación / suela bota:{' '}
                  <strong>{soleMm != null ? `${soleMm} mm` : '—'}</strong>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Stack>

        <Stack spacing={1.5} sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          {readyForPickup && (
            <Typography variant="body2" color="success.main" fontWeight={600}>
              Listo para retiro
            </Typography>
          )}
          {selected && !readyForPickup && (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              disabled={marking}
              onClick={(e) => {
                e.stopPropagation();
                handleMarkReady();
              }}
            >
              {marking ? 'Marcando…' : 'Mark as ready to pick up'}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
