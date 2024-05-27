import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { PROJECT_NAME } from 'src/config-global';
import { paths } from 'src/paths';
import RoleCreateEditForm from 'src/sections/roles/role-create-edit-form';

export default function RoleEdit() {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dashboard: Role Create | {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Settings', href: paths.dashboard.settings.root },
            { name: 'Roles', href: paths.dashboard.settings.roles.root },
            { name: 'Create' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <RoleCreateEditForm />
      </Container>
    </>
  );
}
