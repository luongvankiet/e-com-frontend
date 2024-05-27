import { Navigate } from 'react-router-dom';
import { ICONS } from 'src/components/icons';
import { NotFoundPage, Page500 } from 'src/pages';
import { Login, Register } from 'src/pages/auth';
import { Home } from 'src/pages/client';
import {
  BrandCreate,
  BrandEdit,
  BrandList,
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  Overview,
  ProductCreate,
  ProductEdit,
  ProductList,
  RoleCreate,
  RoleEdit,
  RoleList,
  Settings,
  UserCreate,
  UserEdit,
  UserList,
} from 'src/pages/dashboard';
import paths from './paths';

const dashboard = [
  {
    name: 'Overview',
    action: paths.dashboard.root,
    icon: ICONS.analytics,
    element: <Overview />,
  },
  {
    name: 'Users',
    action: paths.dashboard.users.root,
    icon: ICONS.user,
    element: <UserList />,
    children: [
      {
        name: 'List',
        action: paths.dashboard.users.root,
        permissions: ['users.view-any'],
        element: <UserList />,
      },
      {
        name: 'Create',
        action: paths.dashboard.users.create,
        permissions: ['users.create'],
        element: <UserCreate />,
      },
      {
        name: 'Edit',
        action: paths.dashboard.users.edit,
        permissions: ['users.view'],
        element: <UserEdit />,
        isRoute: true,
      },
    ],
  },
  {
    name: 'Brands',
    action: paths.dashboard.brands.root,
    icon: ICONS.label,
    element: <BrandList />,
    children: [
      {
        name: 'List',
        action: paths.dashboard.brands.root,
        permissions: ['brands.view-any'],
        element: <BrandList />,
      },
      {
        name: 'Create',
        action: paths.dashboard.brands.create,
        permissions: ['brands.create'],
        element: <BrandCreate />,
      },
      {
        name: 'Edit',
        action: paths.dashboard.brands.edit,
        permissions: ['brands.view'],
        element: <BrandEdit />,
        isRoute: true,
      },
    ],
  },
  {
    name: 'Categories',
    action: paths.dashboard.categories.root,
    icon: ICONS.menuItem,
    element: <CategoryList />,
    children: [
      {
        name: 'List',
        action: paths.dashboard.categories.root,
        permissions: ['categories.view-any'],
        element: <CategoryList />,
      },
      {
        name: 'Create',
        action: paths.dashboard.categories.create,
        permissions: ['categories.create'],
        element: <CategoryCreate />,
      },
      {
        name: 'Edit',
        action: paths.dashboard.categories.edit,
        permissions: ['categories.view'],
        element: <CategoryEdit />,
        isRoute: true,
      },
    ],
  },
  {
    name: 'Products',
    action: paths.dashboard.products.root,
    icon: ICONS.product,
    element: <ProductList />,
    children: [
      {
        name: 'List',
        action: paths.dashboard.products.root,
        permissions: ['products.view-any'],
        element: <ProductList />,
      },
      {
        name: 'Create',
        action: paths.dashboard.products.create,
        permissions: ['products.create'],
        element: <ProductCreate />,
      },
      {
        name: 'Edit',
        action: paths.dashboard.products.edit,
        permissions: ['products.view'],
        element: <ProductEdit />,
        isRoute: true,
      },
    ],
  },
  {
    name: 'Settings',
    action: paths.dashboard.settings.root,
    icon: ICONS.settings,
    element: <Settings />,
    children: [
      {
        name: 'Roles',
        action: paths.dashboard.settings.roles.root,
        permissions: ['roles.view-any'],
        element: <RoleList />,
      },
      {
        name: 'Role Create',
        action: paths.dashboard.settings.roles.create,
        element: <RoleCreate />,
        isRoute: true,
      },
      {
        name: 'Role Detail',
        action: paths.dashboard.settings.roles.edit,
        element: <RoleEdit />,
        isRoute: true,
      },
    ],
  },
];

const auth = [
  {
    name: 'Login',
    action: paths.auth.login,
    element: <Login />,
  },
  {
    name: 'Register',
    action: paths.auth.register,
    element: <Register />,
  },
];

const client = [
  {
    name: 'Home',
    action: paths.client.home,
    element: <Home />,
  },
  {
    action: '/500',
    element: <Page500 />,
    isRoute: true,
  },
  {
    action: '/404',
    element: <NotFoundPage />,
    isRoute: true,
  },
  {
    action: '*',
    element: <Navigate to="/404" replace />,
    isRoute: true,
  },
];

const views = {
  dashboard,
  auth,
  client,
};

export default views;
