import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Editor } from 'src/components/editor';
import { useRouter } from 'src/hooks/routes';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { paths } from 'src/paths';
import { ProductService } from 'src/services/product-service';
import Grid from '@mui/material/Unstable_Grid2';
import * as Yup from 'yup';
import { Upload } from 'src/components/upload';

const ProductCreateEditForm = ({ currentProduct }) => {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const [files, setFiles] = useState([]);
  // const [defaultImages, setDefaultImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const confirmDelete = useBoolean();
  const isSubmitting = useBoolean();
  const isDeleting = useBoolean();

  const formik = useFormik({
    initialValues: {
      name: currentProduct?.name || '',
      product_code: currentProduct?.product_code || '',
      sku: currentProduct?.sku || '',
      short_description: currentProduct?.short_description || '',
      description: currentProduct?.description || '',
      quantity: currentProduct?.quantity || 0,
      price: currentProduct?.price || 0,
      discount_price: currentProduct?.discount_price || 0,
      options: currentProduct?.options || [],
      // brand_id: currentProduct?.brand_id || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().max(255).required(),
      price: Yup.number().min(0).required(),
      discount_price: Yup.number().min(0).nullable(),
      quantity: Yup.number().min(0),
    }),
    onSubmit: async (values) => {
      isSubmitting.onTrue();

      console.log(values);

      isSubmitting.onFalse();
    },
  });

  const handleDelete = useCallback(async () => {
    if (!currentProduct) {
      return;
    }

    try {
      await ProductService.deleteMany([currentProduct.id]);
      enqueueSnackbar('Delete Successfully!', { variant: 'success' });
      router.push(paths.dashboard.products.root);
    } catch (error) {
      enqueueSnackbar('Failed to delete!', { variant: 'error' });
      console.error(error);
    }
  }, [currentProduct, router]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((newFile) =>
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        ),
      ]);
    },
    [files]
  );

  const handleRemoveFile = (inputFile) => {
    const filesFiltered = files.filter((fileFiltered) => fileFiltered !== inputFile);
    // const imagesFilted = defaultImages.filter(
    //   (image) => fileNameByUrl(image.url) !== fileNameByUrl(inputFile)
    // );
    // setDefaultImages(imagesFilted);
    setFiles(filesFiltered);
  };

  const handleRemoveAllFiles = () => {
    // setDefaultImages([]);
    setFiles([]);
  };

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
                    label="Short Description"
                    name="short_description"
                    value={formik.values.short_description}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={!!(formik.touched.short_description && formik.errors.short_description)}
                    helperText={formik.touched.short_description && formik.errors.short_description}
                    rows={5}
                  />

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Description</Typography>

                    <Editor
                      id="product-description"
                      simple
                      error={!!(formik.touched.description && formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                      name="description"
                      onChange={(value) => formik.setFieldValue('description', value)}
                      value={formik.values.description}
                    />
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2">Images</Typography>
                    <Upload
                      multiple
                      thumbnail
                      // files={[...files, ...defaultImages.map((image) => image.url)]}
                      files={[...files]}
                      name="images"
                      maxSize={3145728}
                      onDrop={handleDrop}
                      onRemove={handleRemoveFile}
                      onRemoveAll={handleRemoveAllFiles}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {mdUp && (
            <Grid md={4}>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                Properties
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Additional functions and attributes...
              </Typography>
            </Grid>
          )}

          <Grid xs={12} md={8}>
            <Card>
              {!mdUp && <CardHeader title="Properties" />}

              <Stack spacing={3} sx={{ p: 3 }}>
                <Box
                  columnGap={2}
                  rowGap={3}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                  }}
                >
                  <TextField
                    error={!!(formik.touched.product_code && formik.errors.product_code)}
                    fullWidth
                    helperText={formik.touched.product_code && formik.errors.product_code}
                    label="Product Code"
                    name="product_code"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.product_code}
                  />

                  <TextField
                    error={!!(formik.touched.sku && formik.errors.sku)}
                    fullWidth
                    helperText={formik.touched.sku && formik.errors.sku}
                    label="SKU"
                    name="sku"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.sku}
                  />
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete"
        content="Are you sure want to delete product?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
};

export default ProductCreateEditForm;
