import React from 'react';
import { useSettingsContext } from 'src/components/settings';
import { Helmet } from 'react-helmet-async';
import { Button, Container } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/paths';
import { RouterLink } from 'src/components/router-link';
import { Iconify } from 'src/components/iconify';
import { BrandDataTable } from 'src/sections/brands/brand-data-table';
import { PROJECT_NAME } from 'src/config-global';

const BrandList = () => {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Dashboard: Brand List | {PROJECT_NAME}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'md'}>
        <CustomBreadcrumbs
          heading="Brand List"
          links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Brands' }]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.brands.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Brand
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <BrandDataTable />
      </Container>
    </>
  );
};

export default BrandList;
