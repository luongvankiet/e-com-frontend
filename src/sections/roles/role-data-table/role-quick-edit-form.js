import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { PermissionBasedGuard } from 'src/auth/guard/permission-based-guard';
import { useBoolean } from 'src/hooks/use-boolean';
import { RoleService } from 'src/services/role-service';
import { containsAll, containsAtLeastOne } from 'src/utils/array';
import { snakeToTitle } from 'src/utils/string';
import * as Yup from 'yup';

export const RoleQuickEditForm = ({ role, permissions, open, onClose, onDeleteRow, onRefresh }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const isSubmitting = useBoolean();

  const formik = useFormik({
    initialValues: {
      name: role?.display_name || '',
      description: role?.description || '',
      permissions: role?.permissions || [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required!'),
    }),
    onSubmit: async (values) => {
      isSubmitting.onTrue();

      try {
        await RoleService.updateRole(role.id, values);

        setErrorMessage('');
        enqueueSnackbar(`${role ? 'Update' : 'Create'}! successfully!`, { variant: 'success' });
        onRefresh();
        onClose();
      } catch (error) {
        setErrorMessage(error || 'Something went wrong, please refresh page and try again!');
        enqueueSnackbar(`Failed to ${role ? 'update' : 'create'}!`, { variant: 'error' });
      }

      isSubmitting.onFalse();
    },
  });

  const handleSelectPermissionGroup = (event, group) => {
    let newPermissions = [];

    if (event.target.checked) {
      newPermissions = [...formik.values.permissions, ...permissions[group]];
    } else {
      newPermissions = formik.values.permissions.filter(
        (value) => !permissions[group].filter((permission) => permission.name === value.name).length
      );
    }

    formik.setFieldValue('permissions', [...newPermissions]);
  };

  const handleSelectPermission = (event, permission) => {
    let newPermissions = [];

    if (event.target.checked) {
      newPermissions = [...formik.values.permissions, permission];
    } else {
      newPermissions = formik.values.permissions.filter((value) => value.name !== permission.name);
    }

    formik.setFieldValue('permissions', [...newPermissions]);
  };

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { py: 2 },
      }}
    >
      <form noValidate onSubmit={formik.handleSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <PermissionBasedGuard permissions={['roles.view']}>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {errorMessage && (
                <Alert severity="error" onClose={() => setErrorMessage('')}>
                  {errorMessage}
                </Alert>
              )}

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
              
              <TextField
                type="text"
                fullWidth
                multiline
                label="Description"
                name="description"
                value={formik.values.description}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={!!(formik.touched.description && formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                rows={3}
              />

              <Stack
                spacing={2}
                sx={{
                  pt: 0,
                  p: 4,
                  width: 1,
                  borderRadius: 2,
                  bgcolor: 'background.neutral',
                }}
              >
                <Typography variant="h5">Permissions</Typography>
                <Grid container rowSpacing={4} direction="row">
                  {Object.keys(permissions).map((group) => (
                    <Grid xs={12} md={6} key={group}>
                      <FormControlLabel
                        label={<Typography variant="subtitle1">{snakeToTitle(group)}</Typography>}
                        control={
                          <Checkbox
                            size="small"
                            checked={containsAll(
                              permissions[group] || [],
                              formik.values.permissions || []
                            )}
                            indeterminate={
                              containsAtLeastOne(
                                permissions[group] || [],
                                formik.values.permissions || []
                              ) &&
                              !containsAll(
                                permissions[group] || [],
                                formik.values.permissions || []
                              )
                            }
                            onChange={(event) => handleSelectPermissionGroup(event, group)}
                          />
                        }
                        // sx={{ ml: 0, mr: 1 }}
                      />

                      <Stack spacing={1} sx={{ mt: 1 }} useFlexGap flexWrap="wrap">
                        {permissions[group].map((permission) => (
                          <FormControlLabel
                            key={permission.name}
                            label={permission.description || permission.name}
                            control={
                              <Checkbox
                                checked={
                                  !!formik.values.permissions.find(
                                    (value) => value.name === permission.name
                                  )
                                }
                                onChange={(event) => handleSelectPermission(event, permission)}
                              />
                            }
                          />
                        ))}
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
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
