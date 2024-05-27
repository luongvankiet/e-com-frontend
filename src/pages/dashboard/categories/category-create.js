import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { PROJECT_NAME } from 'src/config-global';
import { paths } from 'src/paths';
import CategoryCreateEditForm from 'src/sections/categories/category-create-edit-form';

const CategoryCreate = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dashboard: Category Create | {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Categories', href: paths.dashboard.categories.root },
            { name: 'Create' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <CategoryCreateEditForm />
      </Container>
    </>
  );
};

export default CategoryCreate;
