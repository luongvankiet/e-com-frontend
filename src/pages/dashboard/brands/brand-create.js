import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/paths';
import BrandCreateEditForm from 'src/sections/brands/brand-create-edit-form';
import { PROJECT_NAME } from 'src/config-global';

const BrandCreate = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dashboard: Brand Create | {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'md'}>
        <CustomBreadcrumbs
          heading="Create"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Brands', href: paths.dashboard.brands.root },
            { name: 'Create' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <BrandCreateEditForm />
      </Container>
    </>
  );
};

export default BrandCreate;
