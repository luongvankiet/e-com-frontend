import React, { useCallback, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'src/hooks/routes';
import { useFormik } from 'formik';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Alert,
  TextField,
  Autocomplete,
  Button,
} from '@mui/material';
import UploadAvatar from 'src/components/upload/upload-avatar';
import { useBoolean } from 'src/hooks/use-boolean';
import { fData } from 'src/utils/format-number';
import Label from 'src/components/label';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { AuthContext } from 'src/auth/context';
import { RoleService } from 'src/services/role-service';
import { paths } from 'src/paths';

const UserGeneralForm = ({ currentUser }) => {
  const { hasPermissions } = useContext(AuthContext);
  const { roles } = RoleService.useGetRoleList();

  const [avatar, setAvatar] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const isSubmitting = useBoolean();
  const isDeleting = useBoolean();
  const isSendingEmail = useBoolean();
  const showPassword = useBoolean();
  const confirmDelete = useBoolean();

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      email: currentUser?.email || '',
      phone_number: currentUser?.phone_number || '',
      role: currentUser?.role || null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      first_name: Yup.string().required('First Name is required!').max(255),
      last_name: Yup.string().required('Last Name is required!').max(255),
      email: Yup.string().required('Email is required!').email('Email is invalid!').max(255),
      phone_number: Yup.string().required('Phone Number is required!').max(255),
    }),
    onSubmit: async (values) => {
      isSubmitting.onTrue();

      console.log(values);

      isSubmitting.onFalse();
    },
  });

  const handleDropAvatar = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setAvatar(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        })
      );
    }
  }, []);

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <Box sx={{ mb: 5 }}>
              <UploadAvatar
                file={avatar}
                onDrop={handleDropAvatar}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
              {currentUser && (
                <>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ justifyContent: 'space-between', width: 1 }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Email Verified
                    </Typography>
                    <Label color={(!!currentUser.verifiedEmailAt && 'success') || 'warning'}>
                      {(!!currentUser.verifiedEmailAt && 'Verified') || 'Pending'}
                    </Label>
                  </Stack>

                  <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', width: 1 }}>
                    {!currentUser.verifiedEmailAt && (
                      <LoadingButton
                        variant="contained"
                        color="primary"
                        // onClick={onSendEmail}
                        loading={isSendingEmail.value}
                      >
                        Send Email
                      </LoadingButton>
                    )}
                    <LoadingButton
                      variant="contained"
                      color="error"
                      onClick={() => confirmDelete.onTrue()}
                      loading={isDeleting.value}
                    >
                      Delete User
                    </LoadingButton>
                  </Stack>
                </>
              )}
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            {!!errorMessage && (
              <Alert severity="error" onClose={() => setErrorMessage('')}>
                {errorMessage}
              </Alert>
            )}

            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.first_name && formik.errors.first_name)}
                      fullWidth
                      helperText={formik.touched.first_name && formik.errors.first_name}
                      label="First Name"
                      name="first_name"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      value={formik.values.first_name}
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.last_name && formik.errors.last_name)}
                      fullWidth
                      helperText={formik.touched.last_name && formik.errors.last_name}
                      label="Last Name"
                      name="last_name"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      value={formik.values.last_name}
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.email && formik.errors.email)}
                      fullWidth
                      helperText={formik.touched.email && formik.errors.email}
                      label="Email"
                      name="email"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      value={formik.values.email}
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.phone_number && formik.errors.phone_number)}
                      fullWidth
                      helperText={formik.touched.phone_number && formik.errors.phone_number}
                      label="Phone Number"
                      name="phone_number"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      value={formik.values.phone_number}
                    />
                  </Grid>

                  {hasPermissions('users.roles.assign') && (
                    <Grid xs={12} md={6}>
                      <Autocomplete
                        fullWidth
                        options={roles}
                        getOptionLabel={(option) => option.display_name || ''}
                        value={formik.values.role}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        onChange={(event, value) => formik.setFieldValue('role', value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Role"
                            error={!!(formik.touched.role && formik.errors.role)}
                            helperText={formik.touched.role && formik.errors.role}
                          />
                        )}
                      />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            <Stack spacing={3} direction="row" justifyContent="flex-end">
              <Button variant="outlined" onClick={() => router.push(paths.dashboard.users.root)}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting.value}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

UserGeneralForm.propTypes = { currentUser: PropTypes.object };

export default UserGeneralForm;
