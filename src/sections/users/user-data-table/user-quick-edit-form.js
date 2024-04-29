import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useBoolean } from 'src/hooks/use-boolean';
import { useFormik } from 'formik';
import { Alert, Dialog, Stack, TextField } from '@mui/material';
import { DialogTitle } from '@mui/material/DialogTitle';
import { PermissionBasedGuard } from 'src/auth/guard/permission-based-guard';
import { DialogContent } from '@mui/material/DialogContent';
import Grid from '@mui/material/Unstable_Grid2';

const UserQuickEditForm = ({ user, open, onClose }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const isSubmitting = useBoolean();

  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
    },
  });

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose} PaperProps={{ sx: { py: 2 } }}>
      <form noValidate onSubmit={formik.handleSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <PermissionBasedGuard>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {errorMessage && (
                <Alert severity="error" onClose={() => setErrorMessage('')}>
                  {errorMessage}
                </Alert>
              )}

              {!user.email_verified_at && (
                <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                  Account is waiting for confirmation
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <TextField
                    error={!!(formik.touched.name && formik.errors.name)}
                    fullWidth
                    helperText={formik.touched.name && formik.errors.name}
                    label="Name"
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.name}
                  />
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
        </PermissionBasedGuard>
      </form>
    </Dialog>
  );
};

UserQuickEditForm.propTypes = {
  user: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default UserQuickEditForm;
