import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { PermissionBasedGuard } from 'src/auth/guard';
import { Upload } from 'src/components/upload';
import { useBoolean } from 'src/hooks/use-boolean';
import { BrandService } from 'src/services/brand-service';
import * as Yup from 'yup';

const BrandQuickEditForm = ({ brand, open, onClose, onDeleteRow, onRefresh }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const isSubmitting = useBoolean();

  const formik = useFormik({
    initialValues: {
      name: brand?.name || '',
      description: brand?.description || '',
      published_at: brand?.published_at || '',
      image: brand?.image || null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required!').max(255),
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
        await BrandService.updateBrand(brand.id, values);

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
    <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
      <form noValidate onSubmit={formik.handleSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <PermissionBasedGuard permissions={['brands.update']}>
          <DialogContent sx={{ py: 2 }}>
            <Stack spacing={3} sx={{ mt: 1 }}>
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

BrandQuickEditForm.propTypes = {
  brand: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default BrandQuickEditForm;
