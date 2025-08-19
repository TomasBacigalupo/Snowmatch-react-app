# Financial Dashboard - SnowMatch Admin

## Overview

The Financial Dashboard is a comprehensive admin tool for managing bookings, payments, and payouts in the SnowMatch platform. It provides real-time insights into financial performance, booking management, and instructor payouts.

## Features

### 🔍 Advanced Filtering
- **Date Range**: Filter by custom date ranges (default: last 90 days)
- **Resort**: Filter by specific ski resorts (default: Cerro Catedral)
- **Instructor**: Autocomplete search for specific instructors
- **Booking Status**: Filter by pending/confirmed/cancelled/completed
- **Payout Status**: Filter by pending/paid/failed
- **Payment Method**: Filter by stripe/cash/transfer/other

### 📊 KPI Dashboard
- **Total Reservas**: Count of all bookings
- **Ingresos Cobrados**: Total revenue from successful payments
- **Pagos Pendientes**: Total pending payouts to instructors
- **Payouts Realizados**: Total completed payouts
- **Con/Sin Payout**: Bookings with/without associated payouts
- **Con Factura**: Bookings with teacher invoices uploaded

### 📈 Interactive Charts
1. **Revenue Time Series**: Line chart showing daily/weekly/monthly revenue trends
2. **Payment Method Breakdown**: Donut chart showing payment method distribution
3. **Bookings Time Series**: Bar chart showing booking volume over time

### 📋 Data Tables

#### Payouts Table
- Payout ID, Booking ID, Instructor Name
- Amount, Currency, Status
- Scheduled/Paid Date
- Invoice URL (if available)
- Actions: Mark as Paid, View Invoice, Download CSV

#### Bookings Table
- Booking ID, Creation Date, Student/Teacher IDs
- Resort, Status, Payment Status
- Payment Method, Has Payout indicator
- Invoice URL, Total Charged
- Search and sort functionality

### 🚀 Actions
- **Apply Filters**: Apply selected filters to data
- **Clear Filters**: Reset all filters to defaults
- **Export CSV**: Download filtered data as CSV file

## File Structure

```
src/
├── pages/dashboard/
│   └── AdminFinancialDashboard.js          # Main dashboard page
├── sections/@dashboard/admin/financial/
│   ├── FinancialFiltersBar.js              # Filter controls
│   ├── FinancialKPICards.js                # KPI metrics cards
│   ├── FinancialCharts.js                  # Chart components
│   ├── PayoutsTable.js                     # Payouts data table
│   └── BookingsTable.js                    # Bookings data table
├── redux/slices/
│   └── admin.js                            # Redux actions & state
├── routes/
│   ├── paths.js                            # Route definitions
│   └── index.js                            # Route configuration
└── _mock/
    └── _financialData.js                   # Mock data for testing
```

## Components

### FinancialFiltersBar
- Date range pickers with Material-UI DatePicker
- Resort dropdown with predefined options
- Instructor autocomplete with API integration
- Status and payment method filters
- Action buttons for apply/clear/export

### FinancialKPICards
- Responsive grid layout
- Color-coded metrics with icons
- Loading skeletons
- Tooltips for additional information

### FinancialCharts
- **RevenueChart**: Area chart with gradient fill
- **PaymentMethodChart**: Donut chart with legend
- **BookingsChart**: Bar chart with custom styling
- All charts use ReactApexChart with Material-UI theming

### PayoutsTable
- Sortable columns
- Search functionality
- Pagination
- Action buttons for each row
- Status chips with color coding

### BookingsTable
- Comprehensive booking information
- Multiple status indicators
- Invoice viewing capability
- Responsive design

## Redux Integration

### State Structure
```javascript
financialData: {
  bookings: [],
  payouts: [],
  payments: [],
  kpis: {
    totalBookings: 0,
    totalRevenue: 0,
    pendingPayouts: 0,
    completedPayouts: 0,
    bookingsWithPayout: 0,
    bookingsWithoutPayout: 0,
    bookingsWithInvoice: 0,
  },
  charts: {
    revenueTimeSeries: [],
    paymentMethodBreakdown: [],
    bookingsTimeSeries: [],
  },
}
```

### Actions
- `getFinancialData(filters)`: Fetch financial data with filters
- `exportFinancialData(filters)`: Export data as CSV
- `markPayoutAsPaid(payoutId)`: Mark payout as paid

## API Endpoints

The dashboard expects the following API endpoints:

### GET /api/admin/financial/data
Query parameters:
- `startDate`: ISO date string
- `endDate`: ISO date string
- `resort`: Resort name
- `instructor`: Instructor ID
- `bookingStatus`: Booking status filter
- `payoutStatus`: Payout status filter
- `paymentMethod`: Payment method filter

Response:
```javascript
{
  bookings: [...],
  payouts: [...],
  payments: [...],
  kpis: {...},
  charts: {...}
}
```

### GET /api/admin/financial/export
- Same query parameters as data endpoint
- Returns CSV file as blob

### PUT /api/payouts/:id/mark-paid
- Marks a payout as paid
- Updates paidAt timestamp

## Usage

### Access
Navigate to `/dashboard/admin/financial` (requires admin role)

### Filtering Data
1. Set date range using date pickers
2. Select resort from dropdown
3. Search for specific instructor
4. Choose status filters as needed
5. Click "Apply Filters" or press Enter

### Exporting Data
1. Apply desired filters
2. Click "Export CSV" button
3. File will download automatically

### Managing Payouts
1. View payouts in the Payouts table
2. Click "Mark as Paid" button for pending payouts
3. View invoices by clicking the invoice icon
4. Download individual payout data

## Styling

The dashboard uses Material-UI components with custom theming:
- Consistent color scheme with status indicators
- Responsive design for mobile and desktop
- Loading states and error handling
- Hover effects and transitions

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data
2. **Advanced Analytics**: More detailed financial insights
3. **Bulk Actions**: Mass operations on payouts/bookings
4. **Email Notifications**: Automated payout confirmations
5. **Multi-currency Support**: Handle different currencies
6. **Audit Trail**: Track all financial operations
7. **Reporting**: Scheduled reports and analytics

## Testing

The dashboard includes mock data for testing:
- Sample bookings with various statuses
- Mock payouts with different states
- Chart data for visualization testing
- KPI calculations for verification

To test with real data, replace the mock data import with actual API calls in `AdminFinancialDashboard.js`.

## Dependencies

- React 18+
- Material-UI 5+
- ReactApexChart
- Redux Toolkit
- React Router
- Date-fns (for date handling)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+ 