import { Font, StyleSheet } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const styles = StyleSheet.create({
  page: {
    padding: '40px 32px',
    fontSize: 9,
    lineHeight: 1.5,
    fontFamily: 'Roboto',
    backgroundColor: '#fff',
  },
  mb8: { marginBottom: 8 },
  mb24: { marginBottom: 24 },
  mb40: { marginBottom: 40 },
  overline: {
    fontSize: 8,
    marginBottom: 6,
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#637381',
  },
  h3: { fontSize: 16, fontWeight: 700 },
  h4: { fontSize: 12, fontWeight: 700 },
  body1: { fontSize: 10 },
  subtitle2: { fontSize: 9, fontWeight: 700 },
  alignRight: { textAlign: 'right' },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  col6: { width: '50%' },
  table: { display: 'flex', width: 'auto' },
  tableRow: {
    padding: '6px 0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
  },
  noBorder: { borderBottomWidth: 0 },
  cellId: { width: '10%' },
  cellDates: { width: '22%' },
  cellCustomer: { width: '28%' },
  cellResort: { width: '22%' },
  cellAmount: { width: '18%', textAlign: 'right' },
  bankBox: {
    marginTop: 32,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
    borderRadius: 4,
  },
});

export default styles;
