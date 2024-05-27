import { Button, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/components/router-link';
import { useSettingsContext } from 'src/components/settings';
import { PROJECT_NAME } from 'src/config-global';
import { paths } from 'src/paths';
import { CategoryDataTable } from 'src/sections/categories/category-data-table';

const CategoryList = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dashboard: Category List | {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Category List"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Categories' }]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.categories.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Category
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <CategoryDataTable />
      </Container>
    </>
  );
};

export default CategoryList;
