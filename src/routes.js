import { Route, Routes } from 'react-router-dom';
import { AuthLayout, ClientLayout, DashboardLayout } from 'src/layouts';
import { views } from 'src/paths';
import { PermissionBasedGuard } from './auth/guard';

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
export const getRoutes = (r, parentIndex = 0) => {
  let rs = [];

  r.map((item, index) => {
    const key = parentIndex.toString() + index;

    if (item.action && item.element) {
      rs.push(
        <Route
          key={key}
          path={item.action}
          element={
            <PermissionBasedGuard permissions={item.permissions}>
              {item.element}
            </PermissionBasedGuard>
          }
        />
      );
    }

    if (item.children?.length) {
      rs = rs.concat(getRoutes(item.children, key));
    }

    return item;
  });

  return rs;
};

const RenderRouters = () => (
  <Routes>
    <Route element={<AuthLayout />}>{getRoutes(views.auth)}</Route>
    <Route element={<DashboardLayout />}>{getRoutes(views.dashboard)}</Route>
    <Route element={<ClientLayout />}>{getRoutes(views.client)}</Route>
  </Routes>
);

export default RenderRouters;
