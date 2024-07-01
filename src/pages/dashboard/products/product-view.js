import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { PROJECT_NAME } from 'src/config-global';
import { useParams } from 'src/hooks/routes';
import { paths } from 'src/paths';
import { ProductService } from 'src/services/product-service';
import ProductDetailsView from 'src/sections/products/product-details/product-details-view';

const ProductView = () => {
  const settings = useSettingsContext();

  const { id } = useParams();

  const { product, productLoading, productError } = ProductService.useGetProductDetail(id);

  return (
    <>
      <Helmet>
        <title>Dashboard: Product View | {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Details"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Products',
              href: paths.dashboard.products.root,
            },
            { name: 'Details' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <ProductDetailsView
          product={product}
          productLoading={productLoading}
          productError={productError}
        />
      </Container>
    </>
  );
};

export default ProductView;
