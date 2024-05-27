import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { PROJECT_NAME } from 'src/config-global';
import { paths } from 'src/paths';
import ProductCreateEditForm from 'src/sections/products/product-create-edit-form';

const ProductCreate = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dashboard: Product Create | {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Products', href: paths.dashboard.products.root },
            { name: 'Create' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <ProductCreateEditForm />
      </Container>
    </>
  );
};

export default ProductCreate;
