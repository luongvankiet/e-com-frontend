import { Button, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/components/router-link';
import { useSettingsContext } from 'src/components/settings';
import { PROJECT_NAME } from 'src/config-global';
import { paths } from 'src/paths';
import { ProductDataTable } from 'src/sections/products/product-data-table';

const ProductList = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dashboard: Product List | {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Product List"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Products' }]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.products.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Product
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <ProductDataTable />
      </Container>
    </>
  );
};

export default ProductList;
