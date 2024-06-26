const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  CLIENT: '/',
};

const paths = {
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
    forgotPassword: `${ROOTS.AUTH}/forgot-password`,
  },
  dashboard: {
    root: `${ROOTS.DASHBOARD}`,
    categories: {
      root: `${ROOTS.DASHBOARD}/categories`,
      create: `${ROOTS.DASHBOARD}/categories/create`,
      edit: `${ROOTS.DASHBOARD}/categories/:id`,
    },
    brands: {
      root: `${ROOTS.DASHBOARD}/brands`,
      create: `${ROOTS.DASHBOARD}/brands/create`,
      edit: `${ROOTS.DASHBOARD}/brands/:id`,
    },
    products: {
      root: `${ROOTS.DASHBOARD}/products`,
      create: `${ROOTS.DASHBOARD}/products/create`,
      edit: `${ROOTS.DASHBOARD}/products/:id/edit`,
      view: `${ROOTS.DASHBOARD}/products/:id`,
    },
    orders: {
      root: `${ROOTS.DASHBOARD}/orders`,
      create: `${ROOTS.DASHBOARD}/orders/create`,
      edit: `${ROOTS.DASHBOARD}/orders/:id/edit`,
      view: `${ROOTS.DASHBOARD}/orders/:id`,
    },
    users: {
      root: `${ROOTS.DASHBOARD}/users`,
      create: `${ROOTS.DASHBOARD}/users/create`,
      edit: `${ROOTS.DASHBOARD}/users/:id`,
    },
    settings: {
      root: `${ROOTS.DASHBOARD}/settings`,
      roles: {
        root: `${ROOTS.DASHBOARD}/settings/roles`,
        create: `${ROOTS.DASHBOARD}/settings/roles/create`,
        edit: `${ROOTS.DASHBOARD}/settings/roles/:id`,
      },
    },
  },
  client: {
    home: `${ROOTS.CLIENT}`,
    products: {
      shop: `/products`,
      detail: `/products/:id`,
    },
    checkout: '/checkout',
  },
};

export default paths;
