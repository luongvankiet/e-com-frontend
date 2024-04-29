import React from 'react';
import { Helmet } from 'react-helmet-async';
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/paths';
import { useSettingsContext } from 'src/components/settings';
import { UserDataTable } from 'src/sections/users/user-data-table';
import Button from '@mui/material/Button';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/components/router-link';

const UserList = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dashboard: User List</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Users', href: paths.dashboard.users.root },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.users.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New User
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <UserDataTable />
      </Container>
    </>
  );
};

export default UserList;
