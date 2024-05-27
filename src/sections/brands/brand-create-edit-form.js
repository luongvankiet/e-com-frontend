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
import { Upload } from 'src/components/upload';
import { useRouter } from 'src/hooks/routes';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { paths } from 'src/paths';
import { BrandService } from 'src/services/brand-service';
import { replaceId } from 'src/utils/string';
import * as Yup from 'yup';

const BrandCreateEditForm = ({ currentBrand }) => {
  const { hasPermissions } = useContext(AuthContext);

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const [errorMessage, setErrorMessage] = useState('');

  const confirmDelete = useBoolean();
  const isSubmitting = useBoolean();
  const isDeleting = useBoolean();

  const formik = useFormik({
    initialValues: {
      name: currentBrand?.name || '',
      description: currentBrand?.description || '',
      published: !!currentBrand?.published_at,
      image: currentBrand?.image || null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required!'),
      image: Yup.mixed()
        .nullable()
        .test('fileSize', 'The file is too large', (value) => !value || value.size <= 2000000)
        .test(
          'type',
          'Only the following formats are accepted: .jpeg, .jpg, .png, .gif and .svg',
          (value) =>
            !value ||
            value.type === 'image/jpeg' ||
            value.type === 'image/jpg' ||
            value.type === 'image/png' ||
            value.type === 'image/gif' ||
            value.type === 'image/svg+xml' ||
            value.type === 'image/webp'
        ),
    }),
    onSubmit: async (values) => {
      isSubmitting.onTrue();

      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => formData.append(key, value));

        if (currentBrand) {
          formData.append('_method', 'put');
          await BrandService.updateBrand(currentBrand.id, formData);
          enqueueSnackbar('Update Successfully!', { variant: 'success' });
        } else {
          const res = await BrandService.createBrand(formData);

          router.push(replaceId(paths.dashboard.brands.edit, res.data.id));
          enqueueSnackbar('Create Successfully!', { variant: 'success' });
        }
        setErrorMessage('');
      } catch (error) {
        console.log(error);
        enqueueSnackbar(`Failed to ${!currentBrand ? 'create' : 'update'}!`, {
          variant: 'error',
        });
      }

      isSubmitting.onFalse();
    },
  });

  const handleDelete = useCallback(async () => {
    if (!currentBrand) {
      return;
    }

    try {
      await BrandService.deleteMany([currentBrand.id]);
      enqueueSnackbar('Delete Successfully!', { variant: 'success' });
      router.push(paths.dashboard.brands.root);
    } catch (error) {
      enqueueSnackbar('Failed to delete!', { variant: 'error' });
      console.error(error);
    }
  }, [currentBrand, router]);

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
                    rows={7}
                  />

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Image</Typography>
                    <Upload
                      file={formik.values.image?.url || formik.values.image?.preview}
                      name="image"
                      maxSize={3145728}
                      onDrop={handleDrop}
                      onDelete={() => formik.setFieldValue('image', null)}
                    />
                    {formik.errors.image && (
                      <Typography variant="caption" color="error">
                        {formik.errors.image}
                      </Typography>
                    )}
                  </Stack>
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
              {currentBrand && hasPermissions('brands.delete') && (
                <LoadingButton
                  variant="contained"
                  color="error"
                  loading={isDeleting.value}
                  onClick={confirmDelete.onTrue}
                >
                  Delete
                </LoadingButton>
              )}

              <Button variant="outlined" onClick={() => router.push(paths.dashboard.brands.root)}>
                Cancel
              </Button>

              <LoadingButton type="submit" variant="contained" loading={isSubmitting.value}>
                {!currentBrand ? 'Create Brand' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </form>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete"
        content="Are you sure want to delete brand?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
};

export default BrandCreateEditForm;
