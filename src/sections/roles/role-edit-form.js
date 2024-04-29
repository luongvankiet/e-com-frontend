import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useRouter } from 'src/hooks/routes';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/paths';
import { PermissionService } from 'src/services/permission-service';
import { RoleService } from 'src/services/role-service';
import { containsAll, containsAtLeastOne } from 'src/utils/array';
import { snakeToTitle, replaceId } from 'src/utils/string';
import * as Yup from 'yup';

export default function RoleEditForm({ role }) {
  const refresh = useBoolean();
  const isSubmitting = useBoolean();
  const router = useRouter();

  const { permissions } = PermissionService.useGetPermissionList({
    refresh: refresh.value,
  });

  const [errorMessage, setErrorMessage] = useState('');

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
        if (role) {
          await RoleService.updateRole(role.id, values);
        } else {
          const response = await RoleService.createRole(values);

          if (response?.data && response?.data?.id) {
            router.push(replaceId(paths.dashboard.settings.roles.edit, response.data.id));
          }
        }
        setErrorMessage('');
        enqueueSnackbar(`${role ? 'Update' : 'Create'}! successfully!`, { variant: 'success' });
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
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <ListItemText
                primary="Roles"
                secondary="Role details"
                primaryTypographyProps={{ typography: 'h6', mb: 0.5 }}
              />
            </Grid>
            <Grid xs={12} md={8}>
              <Stack spacing={3}>
                {errorMessage && (
                  <Alert severity="error" onClose={() => setErrorMessage('')}>
                    {errorMessage}
                  </Alert>
                )}
                <TextField
                  type="text"
                  fullWidth
                  label="Name"
                  name="name"
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={!!(formik.touched.name && formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
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
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <ListItemText
                primary="Permissions"
                secondary="Assign permissions to role"
                primaryTypographyProps={{ typography: 'h6', mb: 0.5 }}
              />
            </Grid>

            <Grid xs={12} md={8}>
              <Stack
                spacing={2}
                divider={<Divider />}
                sx={{
                  pt: 0,
                  p: 4,
                  width: 1,
                  borderRadius: 2,
                  bgcolor: 'background.neutral',
                }}
              >
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

              <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                <Box>
                  {role && (
                    <Button variant="contained" color="error">
                      Delete
                    </Button>
                  )}
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => router.push(paths.dashboard.settings.roles.root)}
                  >
                    Cancel
                  </Button>

                  <LoadingButton
                    variant="contained"
                    size="large"
                    loading={isSubmitting.value}
                    onClick={formik.handleSubmit}
                  >
                    {!role ? 'Create Role' : 'Save Changes'}
                  </LoadingButton>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
