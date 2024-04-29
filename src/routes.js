import { Route, Routes } from 'react-router-dom';
import { AuthLayout, DashboardLayout } from 'src/layouts';
import { views } from 'src/paths';
import { PermissionBasedGuard } from './auth/guard/permission-based-guard';

// get all paths which are defined in paths.js file
export const getPaths = (r, parentIndex = 0) => {
  let rs = [];

  r.map((item, index) => {
    const key = parentIndex.toString() + index;

    if (item.action && item.element) {
      rs.push({ path: item.action });
    }

    if (item.children?.length) {
      rs = rs.concat(getPaths(item.children, key));
    }

    return item;
  });

  return rs;
};

// get all routes which are defined in paths.js file
export const getGuessRoutes = (r, parentIndex = 0) => {
  let rs = [];

  r.map((item, index) => {
    const key = parentIndex.toString() + index;

    if (item.action && item.element) {
      rs.push(<Route key={key} path={item.action} element={item.element} />);
    }

    if (item.children?.length) {
      rs = rs.concat(getGuessRoutes(item.children, key));
    }

    return item;
  });

  return rs;
};

// get all routes which are defined in paths.js file
export const getAdminRoutes = (r, parentIndex = 0) => {
  let rs = [];

  r.map((item, index) => {
    const key = parentIndex.toString() + index;

    if (item.action && item.element) {
      rs.push(
        <Route key={key} element={<PermissionBasedGuard permissions={item.permissions} />}>
          <Route path={item.action} element={item.element} />
        </Route>
      );
    }

    if (item.children?.length) {
      rs = rs.concat(getAdminRoutes(item.children, key));
    }

    return item;
  });

  return rs;
};

const RenderRouters = () => (
  <Routes>
    <Route element={<AuthLayout />}>{getGuessRoutes(views.auth)}</Route>
    <Route element={<DashboardLayout />}>{getAdminRoutes(views.dashboard)}</Route>
    {/* <Route element={<ClientLayout />}>{getRoutes(views.client)}</Route> */}
  </Routes>
);

export default RenderRouters;
