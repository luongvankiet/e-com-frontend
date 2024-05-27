import { LoadingButton } from '@mui/lab';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { PermissionBasedGuard } from 'src/auth/guard';
import { useBoolean } from 'src/hooks/use-boolean';
import { CategoryService } from 'src/services/category-service';
import * as Yup from 'yup';

const CategoryQuickEditForm = ({ category, open, onClose, onDeleteRow, onRefresh }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const isSubmitting = useBoolean();

  const formik = useFormik({
    initialValues: {
      name: category?.name || '',
      description: category?.description || '',
      published_at: category?.published_at || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required!').max(255),
    }),
    onSubmit: async (values) => {
      isSubmitting.onTrue();
      try {
        await CategoryService.updateCategory(category.id, values);

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

        <PermissionBasedGuard permissions={['categories.update']}>
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

CategoryQuickEditForm.propTypes = {
  category: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default CategoryQuickEditForm;
