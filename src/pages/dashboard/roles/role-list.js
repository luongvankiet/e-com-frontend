import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/components/router-link';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/paths';
import { RoleDataTable } from 'src/sections/roles/role-data-table';

const RoleList = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dashboard: Role List</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Role List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Settings', href: paths.dashboard.settings.root },
            { name: 'Roles', href: paths.dashboard.settings.roles.root },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.settings.roles.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Role
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <RoleDataTable />
      </Container>
    </>
  );
};

export default RoleList;
