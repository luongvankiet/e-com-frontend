import { Container } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { PROJECT_NAME } from 'src/config-global';
import { useParams, useRouter } from 'src/hooks/routes';
import { paths } from 'src/paths';
import BrandCreateEditForm from 'src/sections/brands/brand-create-edit-form';
import { BrandService } from 'src/services/brand-service';

const BrandEdit = () => {
  const settings = useSettingsContext();

  const { id } = useParams();

  const { brand, brandError } = BrandService.useGetBrandDetail(id);

  const router = useRouter();

  useEffect(() => {
    if (brandError) {
      enqueueSnackbar('Brand Not Found!', { variant: 'error' });
      setTimeout(() => {
        router.back();
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandError]);

  return (
    <>
      <Helmet>
        <title>Dashboard: Edit Brand | {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'md'}>
        <CustomBreadcrumbs
          heading="Edit"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'brands',
              href: paths.dashboard.brands.root,
            },
            { name: 'Edit' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <BrandCreateEditForm currentBrand={brand} />
      </Container>
    </>
  );
};

export default BrandEdit;
