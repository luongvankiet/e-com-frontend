import { Container } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { PROJECT_NAME } from 'src/config-global';
import { useParams, useRouter } from 'src/hooks/routes';
import { paths } from 'src/paths';
import ProductCreateEditForm from 'src/sections/products/product-create-edit-form';
import { ProductService } from 'src/services/product-service';

const ProductEdit = () => {
  const settings = useSettingsContext();

  const { id } = useParams();

  const { product, productError } = ProductService.useGetProductDetail(id);

  const router = useRouter();

  useEffect(() => {
    if (productError) {
      enqueueSnackbar('Product Not Found!', { variant: 'error' });

      setTimeout(() => {
        router.back();
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productError]);

  return (
    <>
      <Helmet>
        <title>Dashboard: Product Edit | {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Products',
              href: paths.dashboard.products.root,
            },
            { name: 'Edit' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <ProductCreateEditForm currentProduct={product} />
      </Container>
    </>
  );
};

export default ProductEdit;
