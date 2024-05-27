import React from 'react';
import { useSettingsContext } from 'src/components/settings';
import { Helmet } from 'react-helmet-async';
import { Container } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/paths';
import { UserCreateEditForm } from 'src/sections/users/user-create-edit-form';
import { PROJECT_NAME } from 'src/config-global';

const UserCreate = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dashboard: User Create | {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Users', href: paths.dashboard.users.root },
            { name: 'Create' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <UserCreateEditForm />
      </Container>
    </>
  );
};

export default UserCreate;
