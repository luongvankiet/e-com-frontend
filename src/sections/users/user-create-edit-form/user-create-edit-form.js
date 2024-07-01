import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useCallback, useContext, useState } from 'react';
import { AuthContext } from 'src/auth/context';
import { Iconify } from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { UploadAvatar } from 'src/components/upload';
import { useRouter } from 'src/hooks/routes';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/paths';
import { RoleService } from 'src/services/role-service';
import { UserService } from 'src/services/user-service';
import { fData } from 'src/utils/format-number';
import { replaceId } from 'src/utils/string';
import * as Yup from 'yup';

const UserCreateEditForm = ({ currentUser }) => {
  const { roles } = RoleService.useGetRoleList({ disabledPagination: true });

  const { hasPermissions } = useContext(AuthContext);

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const isSubmitting = useBoolean();
  const showPassword = useBoolean();
  const showPasswordConfirmation = useBoolean();

  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      email: currentUser?.email || '',
      phone_number: currentUser?.phone_number || '',
      role: roles.find((role) => role.id === currentUser?.role?.id) || null,
      role_id:
        currentUser?.role?.id ||
        roles.find((role) => role.name !== 'super_admin' && role.name !== 'admin')?.id,
      address_line_1: currentUser?.default_address?.address_line_1 || '',
      address_line_2: currentUser?.default_address?.address_line_2 || '',
      city: currentUser?.default_address?.city || '',
      state: currentUser?.default_address?.state || '',
      country: currentUser?.default_address?.country || '',
      postcode: currentUser?.default_address?.postcode || '',
      password: '',
      password_confirmation: '',
      image: currentUser?.image || null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      first_name: Yup.string().max(255).required('First Name is required!'),
      last_name: Yup.string().max(255).required('Last Name is required!'),
      email: Yup.string().required('Email is required!').email('Email is invalid!').max(255),
      phone_number: Yup.string().required('Phone Number is required!').max(255),
      password: Yup.string()
        .max(255)
        .min(8)
        .test('isValidPass', 'Password is not valid', (value) => {
          if (!value) {
            return true;
          }

          const hasUpperCase = /[A-Z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          let validConditions = 0;
          const numberOfMustBeValidConditions = 3;
          const conditions = [hasUpperCase, hasLowerCase, hasNumber];

          // eslint-disable-next-line no-plusplus
          conditions.forEach((condition) => (condition ? validConditions++ : null));
          if (validConditions >= numberOfMustBeValidConditions) {
            return true;
          }
          return false;
        })
        .test('required', 'Password is required!', (value) => {
          if (!currentUser && !value) {
            return false;
          }
          return true;
        })
        .matches(/^.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*$/, 'Need one special character'),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .test('required', 'Passwords Confirmation is required!', (value) => {
          if (!currentUser && !value) {
            return false;
          }
          return true;
        }),
    }),
    onSubmit: async (values) => {
      console.log(values);
      isSubmitting.onTrue();

      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'role') {
            return;
          }
          formData.append(key, value);
        });

        if (!hasPermissions('users.assign-roles')) {
          formData.delete('role_id');
        }

        if (currentUser) {
          formData.append('_method', 'put');
          await UserService.updateUser(currentUser.id, formData);
        } else {
          const response = await UserService.createUser(formData);

          if (response?.data && response?.data?.id) {
            router.push(replaceId(paths.dashboard.users.edit, response.data.id));
          }
        }
        setErrorMessage('');
        enqueueSnackbar(`${currentUser ? 'Update' : 'Create'}! successfully!`, {
          variant: 'success',
        });
      } catch (error) {
        setErrorMessage(error || 'Something went wrong, please refresh page and try again!');
        enqueueSnackbar(`Failed to ${currentUser ? 'Update' : 'Create'}!`, { variant: 'error' });
      }
      isSubmitting.onFalse();
    },
  });

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    if (file) {
      formik.setFieldValue(
        'image',
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeRole = useCallback((event, value) => {
    formik.setFieldValue('role_id', value?.id);
    formik.setFieldValue('role', value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <Card sx={{ p: 5 }}>
            <CardContent>
              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  file={formik.values.image?.url || formik.values.image}
                  onDrop={handleDrop}
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
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Stack spacing={2}>
            <Card>
              <CardHeader
                title="Account Information"
                subheader="(*) is required fields"
                subheaderTypographyProps={{ typography: 'caption' }}
              />
              <CardContent>
                <Stack spacing={3}>
                  {errorMessage && (
                    <Alert severity="error" onClose={() => setErrorMessage('')}>
                      {errorMessage}
                    </Alert>
                  )}

                  <Grid container spacing={2}>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="First Name*"
                        name="first_name"
                        value={formik.values.first_name}
                        error={!!(formik.touched.first_name && formik.errors.first_name)}
                        helperText={formik.touched.first_name && formik.errors.first_name}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Last Name*"
                        name="last_name"
                        value={formik.values.last_name}
                        error={!!(formik.touched.last_name && formik.errors.last_name)}
                        helperText={formik.touched.last_name && formik.errors.last_name}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid xs={12} md={6}>
                      <TextField
                        type="email"
                        fullWidth
                        label="Email*"
                        name="email"
                        value={formik.values.email}
                        error={!!(formik.touched.email && formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number*"
                        name="phone_number"
                        value={formik.values.phone_number}
                        error={!!(formik.touched.phone_number && formik.errors.phone_number)}
                        helperText={formik.touched.phone_number && formik.errors.phone_number}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    {hasPermissions('users.assign-roles') && (
                      <Grid xs={12} md={6}>
                        <Autocomplete
                          fullWidth
                          options={roles}
                          getOptionLabel={(option) => option.display_name || ''}
                          value={formik.values.role}
                          isOptionEqualToValue={(option, value) => option.id === value?.id}
                          onChange={handleChangeRole}
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
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Address" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Address Line 1"
                      name="address_line_1"
                      value={formik.values.address_line_1}
                      error={!!(formik.touched.address_line_1 && formik.errors.address_line_1)}
                      helperText={formik.touched.address_line_1 && formik.errors.address_line_1}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Address Line 2 (optional)"
                      name="address_line_2"
                      value={formik.values.address_line_2}
                      error={!!(formik.touched.address_line_2 && formik.errors.address_line_2)}
                      helperText={formik.touched.address_line_2 && formik.errors.address_line_2}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="City/Suburb"
                      name="city"
                      value={formik.values.city}
                      error={!!(formik.touched.city && formik.errors.city)}
                      helperText={formik.touched.city && formik.errors.city}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      value={formik.values.state}
                      error={!!(formik.touched.state && formik.errors.state)}
                      helperText={formik.touched.state && formik.errors.state}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      name="country"
                      value={formik.values.country}
                      error={!!(formik.touched.country && formik.errors.country)}
                      helperText={formik.touched.country && formik.errors.country}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Postcode"
                      name="postcode"
                      value={formik.values.postcode}
                      error={!!(formik.touched.postcode && formik.errors.postcode)}
                      helperText={formik.touched.postcode && formik.errors.postcode}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Password" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <TextField
                      error={!!(formik.touched.password && formik.errors.password)}
                      fullWidth
                      helperText={formik.touched.password && formik.errors.password}
                      label="Password"
                      name="password"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type={showPassword.value ? 'text' : 'password'}
                      value={formik.values.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={showPassword.onToggle} edge="end">
                              <Iconify
                                icon={
                                  showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      error={
                        !!(
                          formik.touched.password_confirmation &&
                          formik.errors.password_confirmation
                        )
                      }
                      fullWidth
                      helperText={
                        formik.touched.password_confirmation && formik.errors.password_confirmation
                      }
                      label="Password Confirmation"
                      name="password_confirmation"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type={showPasswordConfirmation.value ? 'text' : 'password'}
                      value={formik.values.password_confirmation}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={showPasswordConfirmation.onToggle} edge="end">
                              <Iconify
                                icon={
                                  showPasswordConfirmation.value
                                    ? 'solar:eye-bold'
                                    : 'solar:eye-closed-bold'
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid xs={12}>
                    <Grid xs={12} md={6}>
                      <Typography variant="body2">
                        Paswords must be at least 8 characters long and have:
                      </Typography>
                      <ul>
                        <li>
                          <Typography variant="body2">
                            at least <b>one uppercase letter</b>
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            at least <b>one lowercase letter</b>
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            at least <b>one digit</b>
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            at least <b>one special character</b>
                          </Typography>
                        </li>
                      </ul>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Stack alignItems="flex-end">
              <LoadingButton type="submit" variant="contained" loading={isSubmitting.value}>
                {!currentUser ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

UserCreateEditForm.propTypes = { currentUser: PropTypes.object };

export default UserCreateEditForm;
