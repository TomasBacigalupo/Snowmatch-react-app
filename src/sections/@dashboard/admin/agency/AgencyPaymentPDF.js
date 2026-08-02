import PropTypes from 'prop-types';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
import snowmatchLogo from '../../../../assets/logo/snowmatch.png';
import { SNOWMATCH_BANK_DETAILS } from '../../../../utils/snowmatchBankDetails';
import { getBookingCustomerLabel } from '../../../../utils/adminBookingParticipants';
import { formatAdminBookingResortLabel } from '../../../../utils/adminBookingResortOptions';
import styles from './AgencyPaymentPDFStyle';

// ----------------------------------------------------------------------

function formatDateRange(eventList) {
  if (!eventList?.length) return '—';
  const dates = eventList
    .map((e) => new Date(e.end || e.start))
    .filter((d) => !Number.isNaN(d.getTime()));
  if (!dates.length) return '—';
  const start = new Date(Math.min(...dates));
  const end = new Date(Math.max(...dates));
  const fmt = (d) =>
    d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return start.getTime() === end.getTime() ? fmt(start) : `${fmt(start)} – ${fmt(end)}`;
}

function formatAmount(amount, currency = 'ARS') {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount || 0);
}

function sumByCurrency(bookings) {
  const totals = {};
  bookings.forEach((booking) => {
    const currency = booking.currency || 'ARS';
    totals[currency] = (totals[currency] || 0) + (Number(booking.price) || 0);
  });
  return Object.entries(totals);
}

function formatIssueDate(date) {
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

AgencyPaymentPDF.propTypes = {
  agency: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  bookings: PropTypes.arrayOf(PropTypes.object).isRequired,
  issueDate: PropTypes.instanceOf(Date),
};

export default function AgencyPaymentPDF({ agency, bookings, issueDate = new Date() }) {
  const totals = sumByCurrency(bookings);
  const logoSrc =
    typeof snowmatchLogo === 'string' && snowmatchLogo.startsWith('data:')
      ? snowmatchLogo
      : typeof window !== 'undefined'
        ? new URL(snowmatchLogo, window.location.origin).href
        : snowmatchLogo;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image source={logoSrc} style={{ height: 40, width: 100 }} />
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.h3}>Solicitud de pago</Text>
            <Text style={styles.body1}>{formatIssueDate(issueDate)}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Emisor</Text>
            <Text style={styles.body1}>{SNOWMATCH_BANK_DETAILS.legalName}</Text>
            <Text style={styles.body1}>CUIT {SNOWMATCH_BANK_DETAILS.cuit}</Text>
          </View>

          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Destinatario</Text>
            <Text style={styles.body1}>{agency.name || '—'}</Text>
            {agency.phone ? <Text style={styles.body1}>{agency.phone}</Text> : null}
            {agency.email ? <Text style={styles.body1}>{agency.email}</Text> : null}
          </View>
        </View>

        <Text style={[styles.overline, styles.mb8]}>Detalle de reservas</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.cellId}>
              <Text style={styles.subtitle2}>ID</Text>
            </View>
            <View style={styles.cellDates}>
              <Text style={styles.subtitle2}>Fechas</Text>
            </View>
            <View style={styles.cellCustomer}>
              <Text style={styles.subtitle2}>Cliente</Text>
            </View>
            <View style={styles.cellResort}>
              <Text style={styles.subtitle2}>Centro</Text>
            </View>
            <View style={styles.cellAmount}>
              <Text style={styles.subtitle2}>Importe</Text>
            </View>
          </View>

          {bookings.map((booking) => (
            <View style={styles.tableRow} key={booking.id}>
              <View style={styles.cellId}>
                <Text style={styles.body1}>#{booking.id}</Text>
              </View>
              <View style={styles.cellDates}>
                <Text style={styles.body1}>{formatDateRange(booking.eventList)}</Text>
              </View>
              <View style={styles.cellCustomer}>
                <Text style={styles.body1}>{getBookingCustomerLabel(booking)}</Text>
              </View>
              <View style={styles.cellResort}>
                <Text style={styles.body1}>
                  {formatAdminBookingResortLabel(booking.resort) || booking.resort || '—'}
                </Text>
              </View>
              <View style={styles.cellAmount}>
                <Text style={styles.body1}>
                  {formatAmount(booking.price, booking.currency || 'ARS')}
                </Text>
              </View>
            </View>
          ))}

          {totals.map(([currency, total]) => (
            <View style={[styles.tableRow, styles.noBorder]} key={currency}>
              <View style={styles.cellId} />
              <View style={styles.cellDates} />
              <View style={styles.cellCustomer} />
              <View style={styles.cellResort}>
                <Text style={styles.h4}>Total a pagar</Text>
              </View>
              <View style={styles.cellAmount}>
                <Text style={styles.h4}>{formatAmount(total, currency)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bankBox}>
          <Text style={[styles.overline, styles.mb8]}>Datos para transferencia</Text>
          <Text style={styles.body1}>
            Alias: <Text style={styles.subtitle2}>{SNOWMATCH_BANK_DETAILS.alias}</Text>
          </Text>
          <Text style={styles.body1}>Razón social: {SNOWMATCH_BANK_DETAILS.legalName}</Text>
          <Text style={styles.body1}>CUIT: {SNOWMATCH_BANK_DETAILS.cuit}</Text>
        </View>
      </Page>
    </Document>
  );
}
