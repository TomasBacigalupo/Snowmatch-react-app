import { Outlet } from 'react-router-dom';

// Parent route for /admin/bookings and /admin/bookings/equipos
export default function AdminBookingsLayout() {
  return <Outlet />;
}
