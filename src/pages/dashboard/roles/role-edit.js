import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { PROJECT_NAME } from 'src/config-global';
import { useParams } from 'src/hooks/routes';
import { paths } from 'src/paths';
import RoleCreateEditForm from 'src/sections/roles/role-create-edit-form';
import { RoleService } from 'src/services/role-service';

export default function RoleEdit() {
  const settings = useSettingsContext();

  const { id } = useParams();

  const { role } = RoleService.useGetRoleDetail(id);

  return (
    <>
      <Helmet>
        <title>Dashboard: Role Edit | {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Settings', href: paths.dashboard.settings.root },
            { name: 'Roles', href: paths.dashboard.settings.roles.root },
            { name: 'Detail' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <RoleCreateEditForm role={role} />
      </Container>
    </>
  );
}
