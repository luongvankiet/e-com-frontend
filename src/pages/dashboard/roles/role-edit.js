import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { useParams } from 'src/hooks/routes';
import { paths } from 'src/paths';
import RoleEditForm from 'src/sections/roles/role-edit-form';
import { RoleService } from 'src/services/role-service';

export default function RoleEdit() {
  const settings = useSettingsContext();

  const { id } = useParams();

  const { role, roleLoading } = RoleService.useGetRoleDetail(id);

  return (
    <>
      <Helmet>
        <title>Dashboard: Role Edit</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Settings', href: paths.dashboard.settings.root },
            { name: 'Roles', href: paths.dashboard.settings.roles.root },
            { name: 'Role Edit' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <RoleEditForm role={role} />
      </Container>
    </>
  );
}
