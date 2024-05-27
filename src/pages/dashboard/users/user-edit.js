import React, { useEffect } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { Helmet } from 'react-helmet-async';
import { Container } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/paths';
import { useParams, useRouter } from 'src/hooks/routes';
import { UserService } from 'src/services/user-service';
import { UserCreateEditForm } from 'src/sections/users/user-create-edit-form';
import { enqueueSnackbar } from 'notistack';
import { PROJECT_NAME } from 'src/config-global';

const UserEdit = () => {
  const settings = useSettingsContext();

  const { id } = useParams();

  const { user, userError } = UserService.useGetUserDetail(id);

  const router = useRouter();

  useEffect(() => {
    if (userError) {
      enqueueSnackbar('User Not Found!', { variant: 'error' });
      setTimeout(() => {
        router.back();
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userError]);

  return (
    <>
      <Helmet>
        <title>Dashboard: User Edit | {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Users', href: paths.dashboard.users.root },
            { name: 'Edit' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <UserCreateEditForm currentUser={user} />
      </Container>
    </>
  );
};

export default UserEdit;
