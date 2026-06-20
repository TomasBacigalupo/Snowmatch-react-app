import { useTranslation } from 'react-i18next';
import { AdminBookingsPage } from './AdminReviewBookings';

export default function AdminGearBookings() {
  const { t } = useTranslation();

  return (
    <AdminBookingsPage
      bookingListKind="gear"
      pageTitle={t('adminBookings.gearPageTitle')}
      heading={t('adminBookings.gearHeading')}
    />
  );
}
