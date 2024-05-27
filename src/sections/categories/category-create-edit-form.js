import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useContext, useState } from 'react';
import { AuthContext } from 'src/auth/context';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useRouter } from 'src/hooks/routes';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { paths } from 'src/paths';
import { CategoryService } from 'src/services/category-service';
import { replaceId } from 'src/utils/string';
import * as Yup from 'yup';

const CategoryCreateEditForm = ({ currentCategory }) => {
  const { hasPermissions } = useContext(AuthContext);

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const [errorMessage, setErrorMessage] = useState('');

  const confirmDelete = useBoolean();
  const isSubmitting = useBoolean();
  const isDeleting = useBoolean();

  const formik = useFormik({
    initialValues: {
      name: currentCategory?.name || '',
      description: currentCategory?.description || '',
      published: !!currentCategory?.published_at,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required!'),
    }),
    onSubmit: async (values) => {
      isSubmitting.onTrue();

      try {
        if (currentCategory) {
          await CategoryService.updateCategory(currentCategory.id, values);
          enqueueSnackbar('Update Successfully!', { variant: 'success' });
        } else {
          const res = await CategoryService.createCategory(values);

          router.push(replaceId(paths.dashboard.categories.edit, res.data.id));
          enqueueSnackbar('Create Successfully!', { variant: 'success' });
        }
        setErrorMessage('');
      } catch (error) {
        console.log(error);
        enqueueSnackbar(`Failed to ${!currentCategory ? 'create' : 'update'}!`, {
          variant: 'error',
        });
      }

      isSubmitting.onFalse();
    },
  });

  const handleDelete = useCallback(async () => {
    if (!currentCategory) {
      return;
    }

    try {
      await CategoryService.deleteMany([currentCategory.id]);
      enqueueSnackbar('Delete Successfully!', { variant: 'success' });
      router.push(paths.dashboard.categories.root);
    } catch (error) {
      enqueueSnackbar('Failed to delete!', { variant: 'error' });
      console.error(error);
    }
  }, [currentCategory, router]);

  return (
    <>
      <form noValidate onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {mdUp && (
            <Grid md={4}>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                Details
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Title, short description, image...
              </Typography>
            </Grid>
          )}

          <Grid xs={12} md={8}>
            <Card>
              {!mdUp && <CardHeader title="Details" />}
              <CardContent>
                <Stack spacing={3}>
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
                    rows={5}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {mdUp && <Grid md={4} />}
          <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.published}
                  onChange={(event) => formik.setFieldValue('published', event.target.checked)}
                />
              }
              label="Publish"
              sx={{ flexGrow: 1, pl: 3 }}
            />

            <Stack direction="row" spacing={2}>
              {currentCategory && hasPermissions('categories.delete') && (
                <LoadingButton
                  variant="contained"
                  color="error"
                  loading={isDeleting.value}
                  onClick={confirmDelete.onTrue}
                >
                  Delete
                </LoadingButton>
              )}

              <Button
                variant="outlined"
                onClick={() => router.push(paths.dashboard.categories.root)}
              >
                Cancel
              </Button>

              <LoadingButton type="submit" variant="contained" loading={isSubmitting.value}>
                {!currentCategory ? 'Create Category' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </form>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete"
        content="Are you sure want to delete category?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
};

export default CategoryCreateEditForm;
