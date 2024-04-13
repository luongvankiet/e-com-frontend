import { Navigate } from 'react-router-dom';
import { ICONS } from 'src/components/icons';
import NotFoundPage from 'src/pages/404';
import Page500 from 'src/pages/500';
import Overview from 'src/pages/dashboard/overview';
import Login from 'src/pages/auth/login';
import Register from 'src/pages/auth/register';

import paths from './paths';

const dashboard = [
  {
    name: 'Overview',
    action: paths.dashboard.root,
    icon: ICONS.analytics,
    element: <Overview />,
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
