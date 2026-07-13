import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// @mui
import {
  Alert,
  Box,
  Card,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

const ars = (value) => `$${Number(value).toLocaleString('es-AR')}`;

// Clases particulares — precio completo (precio total por clase).
const PRIVATE_CLASSES = [
  { label: '2 horas', price: 300000 },
  { label: '3 horas', price: 430000 },
  { label: '6 horas (día completo)', price: 700000 },
];

// Clases particulares — tarifa asignada (precio total por clase).
const PRIVATE_CLASSES_ASSIGNED = [
  { label: '2 horas', price: 225000 },
  { label: '3 horas', price: 300000 },
  { label: '6 horas (día completo)', price: 550000 },
];

// Clases para niños — con equipos (precio total por clase).
const KIDS_CLASSES_WITH_GEAR = [
  { label: '2 horas', price: 180000 },
  { label: '3 horas', price: 200000 },
  { label: '6 horas (día completo)', price: 370000, note: 'incluye almuerzo' },
];

// Clases para niños — sin equipos (precio total por clase).
const KIDS_CLASSES_NO_GEAR = [
  { label: '2 horas', price: 150000 },
  { label: '3 horas', price: 170000 },
  { label: '6 horas (día completo)', price: 330000, note: 'incluye almuerzo' },
];

// Otros productos de clases.
const OTHER_PRODUCTS = [
  { label: 'Clase grupal', price: 80000, unit: 'por persona', note: 'solo clase 2hs' },
  {
    label: 'Bautismo',
    price: 120000,
    unit: 'por persona',
    note: 'incluye combo standard de equipos, solo para iniciantes',
  },
  {
    label: 'Familias',
    price: 550000,
    unit: 'precio total',
    note: 'incluye combo standard para toda la familia',
  },
];

// Alquiler de equipos — precios "desde", por día.
const RENTAL_COMBOS = [
  { label: 'Combo Bronze', price: 50000 },
  { label: 'Combo Plata', price: 78000 },
  { label: 'Combo Oro', price: 100000 },
];

const RENTAL_APPAREL = [
  { label: 'Campera', price: 35000, note: '(Bula)' },
  { label: 'Pantalón', price: 35000, note: '(Bula)' },
  { label: 'Antiparras', price: 20000, note: '(Travesia)' },
  { label: 'Casco', price: 20000, note: '(Travesia)' },
];

// Precio mínimo de salida del instructor (tarifa asignada), por duración y nivel.
const INSTRUCTOR_MIN_PRICES = [
  { label: '2 horas', level1: 80000, level2: 110000 },
  { label: '3 horas', level1: 120000, level2: 160000 },
];

// Tarifas de instructores (lo que cobra el profe por hora, según nivel).
const INSTRUCTOR_RATES = [
  { level: 0, assigned: 19000, referred: 25500 },
  { level: 1, assigned: 28000, referred: 34500 },
  { level: 2, assigned: 38000, referred: 44500 },
  { level: 3, assigned: 45000, referred: 45000 },
  { level: 4, assigned: 45000, referred: 45000 },
  { level: 5, assigned: 45000, referred: 45000 },
];

// ----------------------------------------------------------------------

function PriceTable({ rows, unitLabel }) {
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label} hover>
              <TableCell sx={{ borderBottom: 'none' }}>
                <Typography variant="body2">{row.label}</Typography>
                {row.note && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    {row.note}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right" sx={{ borderBottom: 'none', whiteSpace: 'nowrap' }}>
                <Typography variant="subtitle2">{ars(row.price)}</Typography>
                {(row.unit || unitLabel) && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {row.unit || unitLabel}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

PriceTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      price: PropTypes.number,
      unit: PropTypes.string,
      note: PropTypes.string,
    })
  ),
  unitLabel: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function AdminPricing() {
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const pageTitle = t('menu.pricing');

  return (
    <Page title={pageTitle}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={pageTitle}
          links={[
            { name: t('menu.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('menu.admin'), href: PATH_DASHBOARD.admin.root },
            { name: pageTitle },
          ]}
        />

        <Alert severity="info" icon={<Iconify icon="eva:info-fill" />} sx={{ mb: 3 }}>
          Todos los precios están expresados en <strong>pesos argentinos (ARS)</strong>. Las clases
          muestran el <strong>precio total por clase</strong> (salvo las que indican “por persona”).
          Los alquileres son <strong>precios “desde”, por día</strong>. Las tarifas de instructores
          son <strong>internas</strong>: es lo que cobra el profesor por hora, no lo que paga el
          cliente.
        </Alert>

        {/* ---------------- CLASES ---------------- */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Clases de esquí
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Clase particular"
                subheader="Precio completo · total por clase"
                avatar={<Iconify icon="mdi:ski" width={28} height={28} />}
              />
              <Box sx={{ p: 2, pt: 1 }}>
                <PriceTable rows={PRIVATE_CLASSES} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Clase particular - pretemporada administracion"
                subheader="Tarifa no aplicable a clases requeridas"
                avatar={<Iconify icon="mdi:account-check" width={28} height={28} />}
              />
              <Box sx={{ p: 2, pt: 1 }}>
                <PriceTable rows={PRIVATE_CLASSES_ASSIGNED} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Clase para niños"
                subheader="1 nene → nivel 1 · desde 2 nenes puede salir un nivel 2"
                avatar={<Iconify icon="mdi:human-child" width={28} height={28} />}
              />
              <Box sx={{ p: 2, pt: 1 }}>
                <Typography variant="overline" sx={{ color: 'text.secondary', pl: 1 }}>
                  Con equipos
                </Typography>
                <PriceTable rows={KIDS_CLASSES_WITH_GEAR} />
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="overline" sx={{ color: 'text.secondary', pl: 1 }}>
                  Sin equipos
                </Typography>
                <PriceTable rows={KIDS_CLASSES_NO_GEAR} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Otros productos"
                avatar={<Iconify icon="mdi:tag-multiple" width={28} height={28} />}
              />
              <Box sx={{ p: 2, pt: 1 }}>
                <PriceTable rows={OTHER_PRODUCTS} />
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* ---------------- DESCUENTOS Y CONDICIONES ---------------- */}
        <Card sx={{ mb: 4 }}>
          <CardHeader
            title="Descuentos y condiciones"
            avatar={<Iconify icon="mdi:sale" width={28} height={28} />}
          />
          <Stack spacing={2} sx={{ p: 3, pt: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Iconify icon="mdi:cash" width={22} height={22} sx={{ mt: 0.2, color: 'success.main', flexShrink: 0 }} />
              <Typography variant="body2">
                Todas las <strong>clases</strong> pueden tener un <strong>10% de descuento pagando
                en efectivo</strong>. El descuento <strong>no aplica a alquileres</strong>.
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Iconify icon="mdi:cash-multiple" width={22} height={22} sx={{ mt: 0.2, color: 'success.main', flexShrink: 0 }} />
              <Typography variant="body2">
                Las <strong>clases requeridas</strong> solo se venden a <strong>precio completo</strong>,
                con un <strong>20% de descuento pagando en efectivo</strong>.
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Iconify icon="mdi:tune-variant" width={22} height={22} sx={{ mt: 0.2, color: 'warning.main', flexShrink: 0 }} />
              <Typography variant="body2">
                Posibilidad de <strong>precios flexibles</strong> con{' '}
                <strong>pretemporada administracion requerida</strong>, solo para{' '}
                <strong>niveles 1</strong>.
              </Typography>
            </Stack>

            <Divider />

            <Box>
              <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 1.5 }}>
                <Iconify icon="mdi:cash-lock" width={22} height={22} sx={{ mt: 0.2, color: 'info.main', flexShrink: 0 }} />
                <Typography variant="subtitle2">
                  Precio mínimo para que salga un instructor{' '}
                  <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                    (tarifa asignada)
                  </Typography>
                </Typography>
              </Stack>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Duración</TableCell>
                      <TableCell align="right">Nivel 1</TableCell>
                      <TableCell align="right">Nivel 2</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {INSTRUCTOR_MIN_PRICES.map((row) => (
                      <TableRow key={row.label} hover>
                        <TableCell>{row.label}</TableCell>
                        <TableCell align="right">{ars(row.level1)}</TableCell>
                        <TableCell align="right">{ars(row.level2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Stack>
        </Card>

        {/* ---------------- ALQUILER ---------------- */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Alquiler de equipos{' '}
          <Chip label="desde / por día" size="small" color="warning" variant="outlined" sx={{ ml: 1 }} />
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Combos completos"
                avatar={<Iconify icon="mdi:package-variant-closed" width={28} height={28} />}
              />
              <Box sx={{ p: 2, pt: 1 }}>
                <PriceTable rows={RENTAL_COMBOS} unitLabel="desde / día" />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Indumentaria"
                avatar={<Iconify icon="mdi:tshirt-crew" width={28} height={28} />}
              />
              <Box sx={{ p: 2, pt: 1 }}>
                <PriceTable rows={RENTAL_APPAREL} unitLabel="desde / día" />
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* ---------------- INSTRUCTORES ---------------- */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Tarifas de instructores{' '}
          <Chip label="uso interno" size="small" color="default" variant="outlined" sx={{ ml: 1 }} />
        </Typography>
        <Card>
          <CardHeader
            title="Pago por hora al profesor"
            subheader="Según nivel del instructor. No es el precio al cliente."
            avatar={<Iconify icon="mdi:account-cash" width={28} height={28} />}
          />
          <Box sx={{ p: 2, pt: 1 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nivel</TableCell>
                    <TableCell align="right">Asignada (por hora)</TableCell>
                    <TableCell align="right">Referida (por hora)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {INSTRUCTOR_RATES.map((row) => (
                    <TableRow key={row.level} hover>
                      <TableCell>Nivel {row.level}</TableCell>
                      <TableCell align="right">{ars(row.assigned)}</TableCell>
                      <TableCell align="right">{ars(row.referred)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <Iconify icon="eva:info-outline" sx={{ mt: 0.3, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                <strong>Asignada:</strong> el cliente llegó por Snowmatch y se le asignó el profe.{' '}
                <strong>Referida:</strong> el profe trajo al cliente. En ambos casos es el pago por
                hora al instructor.
              </Typography>
            </Stack>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
