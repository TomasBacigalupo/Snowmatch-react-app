import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import { DashboardLayout, GuestLayout } from '../layouts/dashboard';

import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import PlainLayout from 'src/layouts/PlainLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';
import DeepLinkHandler from '../components/DeepLinkHandler';
import Discounts from 'src/pages/dashboard/Discounts';
import SchoolList from 'src/pages/dashboard/SchoolsList';
import RegisterStudent from 'src/pages/auth/RegisterStudent';
import RoleBasedGuard from 'src/guards/RoleBasedGuard';
import ReviewTeacher from 'src/pages/dashboard/ReviewTeacher';
import VideoUpload from 'src/pages/dashboard/VideoUpload';
import UploadedVideos from 'src/pages/dashboard/UploadedVideos';
import UnratedVideos from 'src/pages/dashboard/UnratedVideos';
import CourseLevels from 'src/pages/dashboard/CourseLevels';
import BackButtonLayout from 'src/layouts/BackButtonLayout';
import Training from 'src/pages/dashboard/Training';
import Maps from 'src/pages/dashboard/Maps';
import SearchPage from 'src/pages/search/resort/discipline';
import BlogEmbed from '../pages/BlogEmbed';
import SnowMatchLanding from 'src/pages/search/resort/discipline/videos';
import GhostWrapper from 'src/pages/dashboard/GhostWrapper';
import GhostPostWrapper from 'src/pages/dashboard/GhostPostWrapper';
import HeliSki from 'src/pages/search/HeliSki';
import PrivacyPolicy from 'src/pages/PrivacyPolicy';
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
  const isMobile = false;

  return (
    <>
      <DeepLinkHandler />
      {useRoutes([
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
          element: <MainLayout />,
          children: [
            { path: 'legal/privacy', element: <PrivacyPolicy /> }
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
          path: 'clases',
          element: (
            <RoleBasedGuard accessibleRoles={['GUEST', 'STUDENT']}>
              <BackButtonLayout />
            </RoleBasedGuard>

          ),
          children: [
            { path: 'instructores/:id', element: <EcommerceTeacherDetails isGuest={true} /> },
            { path: 'bariloche/esqui/:id', element: <EcommerceProductDetails /> },
            { path: 'bariloche/snowboard/:id', element: <EcommerceProductDetails /> },
          ]
        },
        {
          path: 'match',
          element: (<GuestLayout />),
          children: [
            { path: 'feed', element: <Feed /> },
          ]
        },
        {
          path: 'maps',
          element: (<GuestLayout />),
          children: [
            { path: ':id', element: <Maps /> }
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
            { path: 'schools/:id', element: <SchoolDetails isGuest={true} /> },
            { path: 'schools', element: <SchoolList teacherType="school" /> },

            {
              path: 'teacher/:id/review', element:
                <AuthGuard>
                  <ReviewTeacher />
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
            {
              path: 'videoCoach',
              children: [
                { element: <Navigate to="/match/videoCoach/upload" replace />, index: true },
                { path: 'upload', element: <VideoUpload /> },
                { path: 'uploaded', element: <UploadedVideos /> },
                { path: 'unrated', element: <UnratedVideos /> },
                { path: 'training', element: <Training /> }
              ],
            },
          ]
        },
        {
          path: 'match',
          element: (
            <RoleBasedGuard accessibleRoles={['GUEST', 'STUDENT']}>
              <PlainLayout />
            </RoleBasedGuard>

          ),
          children: [
            { element: <Navigate to={'/match/school/:resort'} replace />, index: true },
            { path: '*', element: <EcommerceShop isGuest={true} teacherType="school" /> },
            { path: 'independent', element: <EcommerceShop isGuest={true} teacherType="independent" /> },
            { path: 'school', element: <EcommerceShop isGuest={true} teacherType="school" /> },
            { path: 'chat', element: <Chat /> },
            { path: 'chat/:conversationKey', element: <Chat /> },
          ]
        },
        {
          path: 'reservar-clase-ski',
          element: (
            <RoleBasedGuard accessibleRoles={['GUEST', 'STUDENT', 'TEACHER', 'ADMIN']}>
              <BackButtonLayout />
            </RoleBasedGuard>

          ),
          children: [
            { path: ':slug', element: <EcommerceTeacherDetails isGuest={true} /> }
          ]
        },
        {
          path: 'match',
          element: (
            <RoleBasedGuard accessibleRoles={['GUEST', 'STUDENT']}>
              <BackButtonLayout />
            </RoleBasedGuard>

          ),
          children: [
            { path: 'teacher/:id', element: <EcommerceTeacherDetails isGuest={true} /> },
            { path: 'product/:id', element: <EcommerceProductDetails /> },
            { path: 'teacher/:id/products/:productId', element: <EcommerceTeacherProducts /> },
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
            {
              path: 'videoCoach',
              children: [
                { element: <Navigate to="/match/videoCoach/upload" replace />, index: true },
                { path: 'upload', element: <VideoUpload /> },
                { path: 'uploaded', element: <UploadedVideos /> },
                { path: 'unrated', element: <UnratedVideos /> },
              ],
            },
          ]
        },
        {
          path: 'match',
          element: (
            <RoleBasedGuard accessibleRoles={['GUEST', 'STUDENT']}>
              <BackButtonLayout />
            </RoleBasedGuard>

          ),
          children: [
            {
              path: 'videoCoach',
              children: [
                { path: 'courses', element: <CourseLevels /> },
              ],
            },
          ]
        },

        {
          element: (<GuestLayout />),
          children: [
            { path: 'protips', element: <BlogPosts /> },
            { path: 'protips/posts/:id', element: <BlogPost /> },
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
        {
          element: (<MainLayout />),
          children: [
            {
              path: 'noticias',
              element: <GhostWrapper />
            },
          ]
        },
        {
          element: (<BackButtonLayout />),
          children: [
            {
              path: 'noticias/:slug',
              element: <GhostPostWrapper />
            }]
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
            { path: 'chat', element: <Chat /> },
            { path: 'chat/:conversationKey', element: <Chat /> },
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
                { path: 'clinics', element: <EcommerceShopClinics /> },
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
                { path: 'clients', element: <AdminReviewClients /> },
                { path: 'bookings', element: <AdminReviewBookings /> },
                { path: ':id/confirm', element: <AdminConfirm /> },
                { path: ':id/events', element: <AdminUserEvents /> },
              ],
            },
            {
              path: 'videoCoach',
              children: [
                { element: <Navigate to="/dashboard/videoCoach/upload" replace />, index: true },
                { path: 'upload', element: <VideoUpload /> },
                { path: 'uploaded', element: <UploadedVideos /> },
                { path: 'unrated', element: <UnratedVideos /> },
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
          path: '/pt',
          element: <MainLayout />,
          children: [
            {
              element: isMobile ? <Navigate to="/match/videoCoach/upload" replace /> : <Navigate to="/pt/bariloche" replace />,
              index: true
            },
            { path: 'escola-de-esqui-e-snowboard', element: <SnowMatchLanding /> },
            { path: 'heliski', element: <HeliSki /> },
            { path: 'escuela-de-esqui-y-snowboard', element: <SnowMatchLanding /> },
            { path: ':resort/:discipline/:type', element: <SearchPage /> },
            { path: ':resort/:discipline', element: <SearchPage /> },
            { path: ':resort', element: <SearchPage /> },
            { path: 'about-us', element: <About /> },
            { path: 'contact-us', element: <Contact /> },
            { path: 'faqs', element: <Faqs /> },
          ],
        },
        {
          path: '/',
          element: <MainLayout />,
          children: [
            {
              element: isMobile ? <Navigate to="/match/videoCoach/upload" replace /> : <SearchPage />,
              index: true
            },
            { path: 'all-teachers', element: <AllTeachers /> },
            { path: 'heliski', element: <HeliSki /> },
            { path: 'en/heliski', element: <HeliSki /> },
            { path: 'escuela-de-esqui-y-snowboard', element: <SnowMatchLanding /> },
            { path: 'tips-esqui-snowboard/:tip', element: <SnowMatchLanding /> },
            { path: 'clases-de-ski-bariloche', element: <HomePageBariloche /> },
            { path: 'clases-de-ski-lago-hermoso', element: <HomePageLagoHermoso /> },
            { path: ':resort/:discipline/:type', element: <SearchPage /> },
            { path: ':resort/:discipline', element: <SearchPage /> },
            { path: ':resort', element: <SearchPage /> },
            { path: 'about-us', element: <About /> },
            { path: 'contact-us', element: <Contact /> },
            { path: 'faqs', element: <Faqs /> },
          ],
        },
        { path: '*', element: <Navigate to="/404" replace /> },
      ])}
    </>
  );
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
const EcommerceShopClinics = Loadable(lazy(() => import('../pages/dashboard/EcommerceShopClinics')));
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
const AdminReviewClients = Loadable(lazy(() => import('../pages/dashboard/AdminReviewClients')));
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
const HomePageBariloche = Loadable(lazy(() => import('../pages/HomeBariloche')));
const HomePageLagoHermoso = Loadable(lazy(() => import('../pages/HomeLagoHermoso')));
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
const AllTeachers = Loadable(lazy(() => import('../pages/AllTeachers')));

//School
const Products = Loadable(lazy(() => import('../pages/dashboard/Products')))
const PendingTeachers = Loadable(lazy(() => import('../pages/dashboard/PendingTeachers')))

//RENTAL
const Rental = Loadable(lazy(() => import('../pages/rental/UserRentalData')))

const Feed = Loadable(lazy(() => import('../pages/dashboard/Feed')))

function RedirectToShop({ url }) {
  window.location.replace(url);

  return null;
}
