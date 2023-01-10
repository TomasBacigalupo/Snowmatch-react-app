// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_FIND_A_PRO = '/match' ;
const ROOTS_RENTAL = '/rental';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
};

export const PATH_GUEST = {
  root: ROOTS_FIND_A_PRO,
  school: path(ROOTS_FIND_A_PRO, `/school`),
  independent: path(ROOTS_FIND_A_PRO, `/independent`),
  viewTeacher: (name) => path(ROOTS_FIND_A_PRO, `/teacher/${name}`),
  rental: ROOTS_RENTAL,
  calculate: path(ROOTS_RENTAL, `/calculate`)
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  emailVerification: '/wait-verification',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    discounts: path(ROOTS_DASHBOARD,'/discounts'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  products: path(ROOTS_DASHBOARD, '/products'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    school: path(ROOTS_DASHBOARD, '/user/school'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  school:{
    root: path(ROOTS_DASHBOARD, '/school'),
    list: path(ROOTS_DASHBOARD, '/school/list'),
    new: path(ROOTS_DASHBOARD, '/school/new'),
    edit: (name) => path(ROOTS_DASHBOARD, `/school/${name}/edit`),
    pending: path(ROOTS_DASHBOARD, '/school/pending'),
    teachers: path(ROOTS_DASHBOARD, '/school/teachers'),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    shopInd: path(ROOTS_DASHBOARD, '/e-commerce/shop/independent'),
    shopSchool: path(ROOTS_DASHBOARD, '/e-commerce/shop/school'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    viewTeacher: (name) => path(ROOTS_DASHBOARD, `/e-commerce/teacher/${name}`),
    view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
  admin: {
    root: path(ROOTS_DASHBOARD, '/admin'),
    review: path(ROOTS_DASHBOARD, '/admin/review'),
    confirm: (id) => path(ROOTS_DASHBOARD, `/admin/${id}/confirm`)
  }
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
