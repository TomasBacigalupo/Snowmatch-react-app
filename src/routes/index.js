import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import { DashboardLayout, GuestLayout } from '../layouts/dashboard';

import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';
import Discounts from 'src/pages/dashboard/Discounts';
import SchoolList from 'src/pages/dashboard/SchoolsList';
import RegisterStudent from 'src/pages/auth/RegisterStudent';
import RoleBasedGuard from 'src/guards/RoleBasedGuard';
import ReviewTeacher from 'src/pages/dashboard/ReviewTeacher';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {

  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        {
          path: 'guest-register',
          element: (
            <GuestGuard>
              <RegisterStudent />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'changePassword/:token', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> },
        { path: 'verify-successful/:token', element: <PageVerificationSucceed /> }
      ],
    },
    {
      path: '*',
      element: <MainLayout />
    },
    {
      path: '/chapelco',
      element: <MainLayout />,
      children: [
        { path: 'instructores', element: <ChapelcoPro /> }
      ]
    },
    {
      path: 'rental',
      element: (<GuestLayout />),
      children: [
        { path: 'calculate', element: <Rental isGuest={true} /> }
      ]
    },
    {
      path: 'match',
      element: (
        <RoleBasedGuard accessibleRoles={['GUEST', 'STUDENT']}>
          <GuestLayout />
        </RoleBasedGuard>

      ),
      children: [
        { element: <Navigate to={'/match/school/:resort'} replace />, index: true },
        { path: '*', element: <EcommerceShop isGuest={true} teacherType="school" /> },
        { path: 'independent', element: <EcommerceShop isGuest={true} teacherType="independent" /> },
        { path: 'school', element: <EcommerceShop isGuest={true} teacherType="school" /> },
        { path: 'teacher/:id', element: <EcommerceTeacherDetails isGuest={true} /> },
        { path: 'product/:id', element: <EcommerceProductDetails /> },
        { path: 'teacher/:id/products/:productId', element: <EcommerceTeacherProducts /> },
        { path: 'schools/:id', element: <SchoolDetails isGuest={true} /> },
        { path: 'schools', element: <SchoolList teacherType="school" /> },
        // { path: '*', element: <EcommerceShop isGuest={true} teacherType="school" /> },
        // { path: 'independent', element: <EcommerceShop isGuest={true} teacherType="independent" /> },
        // { path: 'school', element: <EcommerceShop isGuest={true} teacherType="school" /> },
        {
          path: 'teacher/:id', element:
            <EcommerceTeacherDetails isGuest={true} />
        },
        {
          path: 'teacher/:id/review', element:
            <AuthGuard>
              <ReviewTeacher />
            </AuthGuard>
        },
        {
          path: 'teacher/:id/hire', element:
            <AuthGuard>
              <EcommerceCheckoutTeacher />
            </AuthGuard>
        },
        {
          path: 'product/:id/hire', element: 
          <AuthGuard>
            <EcommerceCheckoutProduct />
          </AuthGuard>
        },
        { path: 'lessons', element: <UserLessons /> },
        { path: 'lessons/:eventId', element: <LessonDetails /> },
      ]
    },

    {
      element: (<GuestLayout />),
      children: [
        { path: 'protips', element: <BlogPosts /> },
        {path: 'protips/posts/:id', element: <BlogPost />},
        {
          path: 'protips/new', element:
            <AuthGuard>
              <BlogNewPost />
            </AuthGuard>
        },
      ]
    },
    {
      path: 'shops',
      children: [
        { path: 'trown', element: <RedirectToShop url={"https://www.trown.com.ar"} /> },
        { path: 'salpa', element: <RedirectToShop url={"https://www.salpa.com.ar"} /> },
        { path: 'dignos', element: <RedirectToShop url={"https://dignosofficial.com"} /> },

      ]
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <RoleBasedGuard accessibleRoles={['ADMIN', 'TEACHER', 'SCHOOL_ADMIN']}>
            <DashboardLayout />
          </RoleBasedGuard>
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        { path: 'discounts', element: <Discounts /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'banking', element: <GeneralBanking /> },
        { path: 'booking', element: <GeneralBooking /> },
        { path: 'products', element: <Products /> },
        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
            { path: 'shop', element: <EcommerceShop /> },
            { path: 'shop/independent', element: <EcommerceShop teacherType="independent" /> },
            { path: 'shop/school', element: <EcommerceShop teacherType="school" /> },
            { path: 'shop/schools', element: <SchoolList teacherType="school" /> },
            { path: 'school/:id', element: <SchoolDetails /> },
            { path: 'shop/school', element: <EcommerceShop teacherType="school" /> },
            { path: 'teacher/:id', element: <EcommerceTeacherDetails /> },
            { path: 'teacher/:id/hire', element: <EcommerceCheckoutTeacher /> },
            { path: 'dashboard/product/:id', element: <EcommerceProductDetails /> },
            { path: 'dashboard/product/:id/hire', element: <EcommerceCheckoutProduct /> },
            { path: 'product/:name', element: <EcommerceProductDetails /> },
            { path: 'product', element: <EcommerceProductList /> },
            { path: 'product/new', element: <ProductCreate /> },
            { path: 'product/:id/edit', element: <ProductCreate /> },
            { path: 'private-half/', element: <PrivateProductHalf /> },
            { path: 'private-full/', element: <PrivateProductFull /> },
            { path: 'checkout', element: <EcommerceCheckoutTeacher /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfile /> },
            { path: 'prices', element: <Prices /> },
            { path: 'cards', element: <UserCards /> },
            { path: 'list', element: <ClientList /> },
            { path: 'new', element: <ClientCreate /> },
            { path: ':name/edit', element: <ClientCreate /> },
            { path: 'account', element: <UserAccount /> },
            { path: 'reviews', element: <UserReviews /> },
            { path: 'lessons', element: <UserLessons /> },
            { path: 'lessons/:eventId', element: <LessonDetails /> },
          ],
        },
        {
          path: 'school',
          children: [
            { element: <Navigate to="/dashboard/school/list" replace />, index: true },
            { path: 'list', element: <ClientList /> },
            { path: 'new', element: <ClientCreate /> },
            { path: ':name/edit', element: <ClientCreate /> },
            { path: 'pending', element: <PendingTeachers /> },
            { path: 'teachers', element: <PendingTeachers isPending={false} /> },
          ],
        },
        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
            { path: 'list', element: <InvoiceList /> },
            { path: ':id', element: <InvoiceDetails /> },
            { path: ':id/edit', element: <InvoiceEdit /> },
            { path: 'new', element: <InvoiceCreate /> },
          ],
        },
        {
          path: 'mail',
          children: [
            { element: <Navigate to="/dashboard/mail/all" replace />, index: true },
            { path: 'label/:customLabel', element: <Mail /> },
            { path: 'label/:customLabel/:mailId', element: <Mail /> },
            { path: ':systemLabel', element: <Mail /> },
            { path: ':systemLabel/:mailId', element: <Mail /> },
          ],
        },
        {
          path: 'chat',
          children: [
            { element: <Chat />, index: true },
            { path: 'new', element: <Chat /> },
            { path: ':conversationKey', element: <Chat /> },
          ],
        },
        { path: 'calendar', element: <Calendar /> },
        { path: 'kanban', element: <Kanban /> },
        {
          path: 'admin',
          children: [
            { element: <Navigate to="/dashboard/admin/review" replace />, index: true },
            { path: 'review', element: <AdminReview /> },
            { path: 'bookings', element: <AdminReviewBookings /> },
            { path: ':id/confirm', element: <AdminConfirm /> },
            { path: ':id/events', element: <AdminUserEvents /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: 'pricing', element: <Pricing /> },
        { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: 'access-denied', element: <AccessDenied /> },
        { path: 'verify-email', element: <PageVerify /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'about-us', element: <About /> },
        { path: 'contact-us', element: <Contact /> },
        { path: 'faqs', element: <Faqs /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));
const PageVerificationSucceed = Loadable(lazy(() => import('../pages/PageVerificationSucceed')))

// DASHBOARD

// GENERAL
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const GeneralBanking = Loadable(lazy(() => import('../pages/dashboard/GeneralBanking')));
const GeneralBooking = Loadable(lazy(() => import('../pages/dashboard/GeneralBooking')));

// ECOMMERCE
const EcommerceShop = Loadable(lazy(() => import('../pages/dashboard/EcommerceShop')));
const EcommerceProductDetails = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductDetails')));
const SchoolDetails = Loadable(lazy(() => import('../pages/dashboard/SchoolDetails')));
const EcommerceTeacherDetails = Loadable(lazy(() => import('../pages/dashboard/EcommerceTeacherDetails')));
const EcommerceTeacherProducts = Loadable(lazy(() => import('../pages/dashboard/EcommerceTeacherProducts')));
const EcommerceProductList = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductList')));
const ProductCreate = Loadable(lazy(() => import('../pages/dashboard/ProductCreate')));
const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));
const PrivateProductFull = Loadable(lazy(() => import('../pages/dashboard/PrivateFullDay')));
const PrivateProductHalf = Loadable(lazy(() => import('../pages/dashboard/PrivateHalfDay')));


// TEACHER ECOMMERCE
const EcommerceCheckoutTeacher = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckoutTeacher')));
const EcommerceCheckoutProduct = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckoutProduct.js')));

// INVOICE
const InvoiceList = Loadable(lazy(() => import('../pages/dashboard/InvoiceList')));
const InvoiceDetails = Loadable(lazy(() => import('../pages/dashboard/InvoiceDetails')));
const InvoiceCreate = Loadable(lazy(() => import('../pages/dashboard/InvoiceCreate')));
const InvoiceEdit = Loadable(lazy(() => import('../pages/dashboard/InvoiceEdit')));

// BLOG
const BlogPosts = Loadable(lazy(() => import('../pages/dashboard/BlogPosts')));
const BlogPost = Loadable(lazy(() => import('../pages/dashboard/BlogPost')));
const BlogNewPost = Loadable(lazy(() => import('../pages/dashboard/BlogNewPost')));

// USER
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/UserProfile')));
const Prices = Loadable(lazy(() => import('../pages/dashboard/Prices')));
const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));
const ClientCreate = Loadable(lazy(() => import('../pages/dashboard/ClientCreate')));
const ClientList = Loadable(lazy(() => import('../pages/dashboard/ClientList')));
const UserReviews = Loadable(lazy(() => import('src/pages/dashboard/UserReviews')));
const UserLessons = Loadable(lazy(() => import('src/pages/dashboard/UserLessons')));
const LessonDetails = Loadable(lazy(() => import('src/pages/dashboard/LessonDetails')));

// ADMIN
const AdminReview = Loadable(lazy(() => import('../pages/dashboard/AdminReview')));
const AdminReviewBookings = Loadable(lazy(() => import('../pages/dashboard/AdminReviewBookings')));
const AdminConfirm = Loadable(lazy(() => import('../pages/dashboard/AdminConfirm')));
const AdminUserEvents = Loadable(lazy(() => import('../pages/dashboard/AdminUserEvents')));


// APP
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));
const Mail = Loadable(lazy(() => import('../pages/dashboard/Mail')));
const Calendar = Loadable(lazy(() => import('../pages/dashboard/Calendar')));
const Kanban = Loadable(lazy(() => import('../pages/dashboard/Kanban')));

// MAIN
const HomePage = Loadable(lazy(() => import('../pages/Home')));
const About = Loadable(lazy(() => import('../pages/About')));
const Contact = Loadable(lazy(() => import('../pages/Contact')));
const Faqs = Loadable(lazy(() => import('../pages/Faqs')));
const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Pricing = Loadable(lazy(() => import('../pages/Pricing')));
const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
const AccessDenied = Loadable(lazy(() => import('../pages/AccessDenied')));
const PageVerify = Loadable(lazy(() => import('../pages/PageVerify')));
const ChapelcoPro = Loadable(lazy(() => import('../pages/pro/ChapelcoPro')));

//School
const Products = Loadable(lazy(() => import('../pages/dashboard/Products')))
const PendingTeachers = Loadable(lazy(() => import('../pages/dashboard/PendingTeachers')))

//RENTAL
const Rental = Loadable(lazy(() => import('../pages/rental/UserRentalData')))

function RedirectToShop({ url }) {
  window.location.replace(url);

  return null;
}
