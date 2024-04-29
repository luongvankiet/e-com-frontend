import { Navigate } from 'react-router-dom';
import { ICONS } from 'src/components/icons';
import { NotFoundPage, Page500 } from 'src/pages';
import { Login, Register } from 'src/pages/auth';
import { Overview, RoleEdit, RoleList, Settings, UserList } from 'src/pages/dashboard';
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
    children: [
      {
        name: 'List',
        action: paths.dashboard.users.root,
        element: <UserList />,
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
        action: paths.dashboard.settings.roles.edit,
        element: <RoleEdit />,
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
