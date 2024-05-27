import { Container } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { PROJECT_NAME } from 'src/config-global';
import { useParams, useRouter } from 'src/hooks/routes';
import { paths } from 'src/paths';
import CategoryCreateEditForm from 'src/sections/categories/category-create-edit-form';
import { CategoryService } from 'src/services/category-service';

const CategoryEdit = () => {
  const settings = useSettingsContext();

  const { id } = useParams();

  const { category, categoryError } = CategoryService.useGetCategoryDetail(id);

  const router = useRouter();

  useEffect(() => {
    if (categoryError) {
      enqueueSnackbar('Category Not Found!', { variant: 'error' });
      setTimeout(() => {
        router.back();
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryError]);

  return (
    <>
      <Helmet>
        <title>Dashboard: Category Edit | {PROJECT_NAME}</title>
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
              name: 'Categories',
              href: paths.dashboard.categories.root,
            },
            { name: 'Edit' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <CategoryCreateEditForm currentCategory={category} />
      </Container>
    </>
  );
};

export default CategoryEdit;
