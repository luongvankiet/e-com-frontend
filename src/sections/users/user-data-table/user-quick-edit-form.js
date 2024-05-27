import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { AuthContext } from 'src/auth/context';
import { PermissionBasedGuard } from 'src/auth/guard';
import { useBoolean } from 'src/hooks/use-boolean';
import { UserService } from 'src/services/user-service';
import * as Yup from 'yup';

const UserQuickEditForm = ({ user, roles, open, onClose, onDeleteRow, onRefresh }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const isSubmitting = useBoolean();

  const { hasPermissions } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
      role: user?.role || null,
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
      try {
        if (!hasPermissions('users.assign-roles')) {
          delete values.role;
        }

        const data = { ...values, role_id: values.role?.id };

        await UserService.updateUser(user.id, data);

        setErrorMessage('');
        enqueueSnackbar('Update successfully!', { variant: 'success' });
        onRefresh();
        onClose();
      } catch (error) {
        setErrorMessage(error || 'Something went wrong, please refresh page and try again!');
        enqueueSnackbar('Failed to create!', { variant: 'error' });
      }

      isSubmitting.onFalse();
    },
  });

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
      <form noValidate onSubmit={formik.handleSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <PermissionBasedGuard permissions={['users.update']}>
          <DialogContent sx={{ py: 2 }}>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {errorMessage && (
                <Alert severity="error" onClose={() => setErrorMessage('')}>
                  {errorMessage}
                </Alert>
              )}

              {!user.email_verified_at && (
                <Alert variant="outlined" severity="info">
                  Account is waiting for confirmation
                </Alert>
              )}

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

                {hasPermissions('users.assign-roles') && (
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
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3 }}>
            <Stack direction="row" spacing={2} width="100%" justifyContent="space-between">
              <Button variant="contained" color="error" onClick={onDeleteRow}>
                Delete
              </Button>

              <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>

                <LoadingButton type="submit" variant="contained" loading={isSubmitting.value}>
                  Save
                </LoadingButton>
              </Stack>
            </Stack>
          </DialogActions>
        </PermissionBasedGuard>
      </form>
    </Dialog>
  );
};

UserQuickEditForm.propTypes = {
  user: PropTypes.object,
  roles: PropTypes.array,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default UserQuickEditForm;
